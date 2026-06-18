import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt, { SignOptions } from "jsonwebtoken";
import prisma, { Prisma } from "@trace-stack/db";
import {
  LoginInput,
  RegisterInput,
  ResendVerificationInput,
  VerifyEmailInput,
} from "@trace-stack/shared";
import { config } from "../config";
import { AppError } from "../utils/errors";
import { sendVerificationEmail } from "./email.service";

const PASSWORD_HASH_ROUNDS = 12;

interface SanitizedUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  emailVerifiedAt: Date | null;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function sanitizeUser(user: SanitizedUser): SanitizedUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    emailVerifiedAt: user.emailVerifiedAt,
  };
}

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function createRawToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

function createVerificationUrl(token: string): string {
  const url = new URL("/verify-email", config.APP_URL);
  url.searchParams.set("token", token);
  return url.toString();
}

function signAccessToken(user: SanitizedUser): string {
  const options: SignOptions = {
    expiresIn: config.API_JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign(
    {
      sub: user.id,
      userId: user.id,
      email: user.email,
      name: user.name,
    },
    config.API_JWT_SECRET,
    options,
  );
}

async function createAndSendVerificationToken(
  email: string,
  name: string | null,
): Promise<boolean> {
  const rawToken = createRawToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(
    Date.now() + config.EMAIL_VERIFICATION_EXPIRES_MINUTES * 60 * 1000,
  );

  await prisma.emailVerificationToken.deleteMany({
    where: { email },
  });

  await prisma.emailVerificationToken.create({
    data: {
      email,
      tokenHash,
      expiresAt,
    },
  });

  return sendVerificationEmail({
    to: email,
    name,
    verificationUrl: createVerificationUrl(rawToken),
  });
}

export async function register(input: RegisterInput) {
  const email = normalizeEmail(input.email);
  const name = input.name.trim();
  const passwordHash = await bcrypt.hash(input.password, PASSWORD_HASH_ROUNDS);

  try {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          name,
        },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          emailVerifiedAt: true,
        },
      });

      const organization = await tx.organization.create({
        data: {
          name: `${name}'s Organization`,
          ownerId: user.id,
        },
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
      });

      return { user, organization };
    });

    const verificationEmailSent = await createAndSendVerificationToken(
      email,
      name,
    );

    return {
      user: sanitizeUser(result.user),
      organization: result.organization,
      verificationEmailSent,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError("An account with this email already exists.", 409);
    }

    throw error;
  }
}

export async function login(input: LoginInput) {
  const email = normalizeEmail(input.email);
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      passwordHash: true,
      name: true,
      image: true,
      emailVerifiedAt: true,
    },
  });

  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  const isPasswordValid = await bcrypt.compare(
    input.password,
    user.passwordHash,
  );

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password.", 401);
  }

  if (!user.emailVerifiedAt) {
    throw new AppError("Please verify your email before signing in.", 403);
  }

  const sanitizedUser = sanitizeUser(user);

  return {
    user: sanitizedUser,
    accessToken: signAccessToken(sanitizedUser),
  };
}

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      emailVerifiedAt: true,
    },
  });

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  return sanitizeUser(user);
}

export async function verifyEmail(input: VerifyEmailInput) {
  const tokenHash = hashToken(input.token);
  const verificationToken = await prisma.emailVerificationToken.findUnique({
    where: { tokenHash },
  });

  if (!verificationToken) {
    throw new AppError("Invalid or expired verification token.", 400);
  }

  if (verificationToken.expiresAt.getTime() < Date.now()) {
    await prisma.emailVerificationToken.delete({
      where: { id: verificationToken.id },
    });
    throw new AppError("Invalid or expired verification token.", 400);
  }

  const user = await prisma.user.findUnique({
    where: { email: verificationToken.email },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      emailVerifiedAt: true,
    },
  });

  if (!user) {
    await prisma.emailVerificationToken.delete({
      where: { id: verificationToken.id },
    });
    throw new AppError("Invalid or expired verification token.", 400);
  }

  const verifiedUser = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: user.id },
      data: {
        emailVerifiedAt: user.emailVerifiedAt ?? new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        emailVerifiedAt: true,
      },
    });

    await tx.emailVerificationToken.deleteMany({
      where: { email: user.email },
    });

    return updatedUser;
  });

  return sanitizeUser(verifiedUser);
}

export async function resendVerification(input: ResendVerificationInput) {
  const email = normalizeEmail(input.email);
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      email: true,
      name: true,
      emailVerifiedAt: true,
    },
  });

  if (user && !user.emailVerifiedAt) {
    await createAndSendVerificationToken(user.email, user.name);
  }

  return {
    message:
      "If an unverified account exists for this email, a verification link has been sent.",
  };
}

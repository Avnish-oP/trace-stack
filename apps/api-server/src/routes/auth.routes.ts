import { Router } from "express";
import {
  LoginSchema,
  RegisterSchema,
  ResendVerificationSchema,
  VerifyEmailSchema,
  OAuthLoginSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
} from "@trace-stack/shared";
import {
  login,
  me,
  register,
  resendVerification,
  verifyEmail,
  oauthLogin,
  forgotPassword,
  resetPassword,
  getDashboardStats,
} from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { redisRateLimit } from "../middlewares/rate-limit.middleware";
import { validate, validateTokenQuery } from "../middlewares/validate.middleware";

const router = Router();

const authRateLimit = redisRateLimit({
  keyPrefix: "auth",
  limit: 20,
  windowSeconds: 60,
});

const verificationResendRateLimit = redisRateLimit({
  keyPrefix: "auth:resend-verification",
  limit: 3,
  windowSeconds: 15 * 60,
  getKey: (req) => String(req.body?.email ?? req.ip ?? "unknown").toLowerCase(),
});

router.post("/register", authRateLimit, validate(RegisterSchema), register);
router.post("/login", authRateLimit, validate(LoginSchema), login);
router.post("/oauth", authRateLimit, validate(OAuthLoginSchema), oauthLogin);
router.post("/forgot-password", authRateLimit, validate(ForgotPasswordSchema), forgotPassword);
router.post("/reset-password", authRateLimit, validate(ResetPasswordSchema), resetPassword);
router.get("/me", authenticate, me);
router.get("/me/stats", authenticate, getDashboardStats);
router.get(
  "/verify-email",
  validateTokenQuery(VerifyEmailSchema),
  verifyEmail,
);
router.post(
  "/resend-verification",
  verificationResendRateLimit,
  validate(ResendVerificationSchema),
  resendVerification,
);

export default router;

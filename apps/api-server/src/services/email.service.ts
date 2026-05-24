import { Resend } from "resend";
import { config } from "../config";

const resend = config.RESEND_API_KEY ? new Resend(config.RESEND_API_KEY) : null;

interface VerificationEmailInput {
  to: string;
  name: string | null;
  verificationUrl: string;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

export async function sendVerificationEmail({
  to,
  name,
  verificationUrl,
}: VerificationEmailInput): Promise<boolean> {
  if (!resend) {
    console.warn(
      `[Email] RESEND_API_KEY is not set. Verification URL for ${to}: ${verificationUrl}`,
    );
    return false;
  }

  const displayName = escapeHtml(name ?? "there");
  const safeVerificationUrl = escapeHtml(verificationUrl);

  await resend.emails.send({
    from: config.EMAIL_FROM,
    to,
    subject: "Verify your TraceStack email",
    html: `
      <div style="font-family: Inter, Arial, sans-serif; line-height: 1.5; color: #111827;">
        <h1 style="font-size: 24px;">Verify your email</h1>
        <p>Hi ${displayName},</p>
        <p>Confirm your email address to finish setting up your TraceStack account.</p>
        <p>
          <a href="${safeVerificationUrl}" style="display: inline-block; background: #6C5CE7; color: white; padding: 12px 18px; border-radius: 8px; text-decoration: none;">
            Verify email
          </a>
        </p>
        <p>This link expires soon. If you did not create a TraceStack account, you can ignore this email.</p>
      </div>
    `,
    text: `Hi ${displayName}, verify your TraceStack email: ${verificationUrl}`,
  });

  return true;
}

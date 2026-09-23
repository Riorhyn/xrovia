const FROM_EMAIL = "XROVIA <noreply@xrovia.com>";

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is missing in the deployment environment");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {"Content-Type":"application/json", Authorization:`Bearer ${apiKey}`},
    body: JSON.stringify({from: FROM_EMAIL, to:[to], subject, html}),
  });
  const result = await response.json();
  if (!response.ok) {
    console.error("RESEND ERROR:", result);
    const message = result?.message || result?.error?.message || JSON.stringify(result);
    throw new Error(`Resend API error (${response.status}): ${message}`);
  }
  return result;
}

export async function sendVerificationEmail(email: string, code: string) {
  return sendEmail(email, "Your XROVIA verification code", `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
      <h2>Verify your XROVIA account</h2><p>Your verification code is:</p>
      <h1 style="letter-spacing:8px">${code}</h1><p>This code expires in 10 minutes.</p>
      <p>If you did not create an XROVIA account, you can ignore this email.</p>
    </div>`);
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://xrovia.com";
  const resetUrl = `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`;
  return sendEmail(email, "Reset your XROVIA password", `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
      <h2>Reset your XROVIA password</h2>
      <p>We received a request to reset your password.</p>
      <p><a href="${resetUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none">Reset Password</a></p>
      <p>This link expires in 30 minutes and can only be used once.</p>
      <p>If you did not request this, you can ignore this email.</p>
    </div>`);
}

export async function sendVerificationInvitationEmail(
  email: string,
  candidateName: string,
  organizationName: string,
  title: string,
  verificationUrl: string,
) {
  return sendEmail(email, `XROVIA verification request for ${candidateName}`, `
    <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#0f172a">
      <h2>Verify a professional record on XROVIA</h2>
      <p><strong>${candidateName}</strong> has requested verification of:</p>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin:18px 0">
        <p style="margin:0;font-weight:700">${title}</p>
        <p style="margin:6px 0 0;color:#64748b">${organizationName}</p>
      </div>
      <p>Open the secure XROVIA verification page using the button below. You will be asked to confirm your name, role, and that the record is accurate.</p>
      <p><a href="${verificationUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:700">Review verification request</a></p>
      <p style="font-size:12px;color:#64748b">This link is intended for the recipient of this email. If you are not the appropriate person to verify this record, do not approve it.</p>
    </div>`);
}

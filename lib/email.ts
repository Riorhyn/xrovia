const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "XROVIA <onboarding@resend.dev>";

export async function sendVerificationEmail(
  email: string,
  code: string
) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [email],
      subject: "Your XROVIA verification code",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
          <h2>Verify your XROVIA account</h2>
          <p>Your verification code is:</p>
          <div style="font-size:32px;font-weight:bold;letter-spacing:8px;margin:24px 0">
            ${code}
          </div>
          <p>This code expires in 10 minutes.</p>
          <p>If you did not create a XROVIA account, you can ignore this email.</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend error: ${error}`);
  }

  return response.json();
}

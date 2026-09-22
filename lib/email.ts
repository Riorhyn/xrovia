const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

export async function sendVerificationEmail(
  email: string,
  code: string
) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is missing");
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
          <h1 style="letter-spacing:8px">${code}</h1>
          <p>This code expires in 10 minutes.</p>
        </div>
      `,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error("RESEND ERROR:", result);
    throw new Error(
      result?.message ||
      result?.error?.message ||
      JSON.stringify(result)
    );
  }

  return result;
}

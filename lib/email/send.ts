import { Resend } from "resend";

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }

  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  const resend = getResend();

  if (!resend || !process.env.RESEND_FROM) {
    console.info("Skipping email send because Resend is not configured", {
      to,
      subject,
    });
    return;
  }

  await resend.emails.send({
    from: process.env.RESEND_FROM,
    to,
    subject,
    html,
  });
}

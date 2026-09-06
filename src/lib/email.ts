import { resend } from "./resend";
import { RegistrationConfirmationEmail } from "@/emails/registration-confirmation";

interface SendConfirmationEmailParams {
  to: string;
  attendeeName: string;
  workshopTitle: string;
  workshopDate: string;
  workshopLocation: string;
  confirmationNumber: string;
  amountPaid: string;
}

export async function sendRegistrationConfirmation({
  to,
  attendeeName,
  workshopTitle,
  workshopDate,
  workshopLocation,
  confirmationNumber,
  amountPaid,
}: SendConfirmationEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Event Platform <onboarding@resend.dev>",
      to: [to],
      subject: `🎉 Registration Confirmed: ${workshopTitle}`,
      react: RegistrationConfirmationEmail({
        attendeeName,
        workshopTitle,
        workshopDate,
        workshopLocation,
        confirmationNumber,
        amountPaid,
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard`,
      }),
    });

    if (error) {
      console.error("[Email Error]", error);
      return { success: false, error: error.message };
    }

    console.log(`✅ Confirmation email sent to ${to} (ID: ${data?.id})`);
    return { success: true, messageId: data?.id };
  } catch (err: any) {
    console.error("[Email Error]", err);
    return { success: false, error: err?.message || "Failed to send email" };
  }
}

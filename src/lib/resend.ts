import { Resend } from "resend";

let resendInstance: Resend | null = null;

export function getResend(): Resend {
  if (!resendInstance) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY environment variable is missing.");
    }
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
}

// For convenience — lazy getter
export const resend = new Proxy({} as Resend, {
  get(_target, prop) {
    return (getResend() as any)[prop];
  },
});

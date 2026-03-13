import { Resend } from "resend";
import { ENV } from "./env.js";

export const resendClient = new Resend(ENV.RESEND_API_KEY); // instance of resend to call it so we can send emails

export const sender = {
  // me, the sender of the email, I will use this info in emailHandlers.js when I call resendClient.emails.send() and specify from field
  email: ENV.EMAIL_FROM,
  name: ENV.EMAIL_FROM_NAME,
};

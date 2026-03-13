import { resendClient, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "./emailTemplates.js";

// this file defines logic of email sending, we will use it in auth.controller.js

export const sendWelcomeEmail = async (email, name, clientURL) => {
  // async function responsible for sending email to user
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`, // from env my name and email actual email info interface
    to: email, // to the email of user who just signed up
    subject: "Welcome to AymeRelay!", // subject of the email
    html: createWelcomeEmailTemplate(name, clientURL), // html template of the email
  });

  // error handling
  if (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }

  console.log("Welcome email sent successfully:", data);
};

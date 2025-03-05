import { transporter } from "../config/email.js";
import {
  EMAIL_VERIFICATION_SUCCESS_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  SUCCESSFUL_TRANSACTION_TEMPLATE,
} from "../templates/emailtemplates.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const emailHtml = VERIFICATION_EMAIL_TEMPLATE.replace(
    "{verificationCode}",
    verificationToken
  );

  const mailOptions = {
    from: '"HostelAlly Support" <no-reply@hostelally.com>',
    to: email,
    subject: "Verify Your Email - HostelAlly",
    html: emailHtml,
  };

  await transporter.sendMail(mailOptions);
};

export const sendWelcomeEmail = async (email, firstName, lastName) => {
  const emailHtml = EMAIL_VERIFICATION_SUCCESS_TEMPLATE.replace(
    "{firstName}",
    firstName
  ).replace("{lastName}", lastName);
  
  try {
    const mailOptions = {
      from: '"HostelAlly Support" <no-reply@hostelally.com>',
      to: email,
      subject: "Welcome Email - HostelAlly",
      html: emailHtml,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending welcome email", error);
    throw new Error(`Error sending welcome email: ${error}`);
  }
};

export const sendPasswordResetEmail = async (email, verificationLink) => {
  const emailHtml = PASSWORD_RESET_REQUEST_TEMPLATE.replace(
    "{resetURL}",
    verificationLink
  );

  try {
    const mailOptions = {
      from: '"HostelAlly Support" <no-reply@hostelally.com>',
      to: email,
      subject: "Password Reset - HostelAlly",
      html: emailHtml,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending password reset email", error);
    throw new Error(`Error sending password reset email: ${error}`);
  }
};

export const sendResetSuccessEmail = async (email) => {
  try {
    const mailOptions = {
      from: '"HostelAlly Support" <no-reply@hostelally.com>',
      to: email,
      subject: "Password Reset Successful - HostelAlly",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending password reset success email", error);
    throw new Error(`Error sending password reset success email: ${error}`);
  }
};

const replacePlaceholders = (template, replacements) => {
  return template.replace(/{(\w+)}/g, (_, key) => replacements[key] || `{${key}}`);
};

export const sendTransactionSuccess = async (email, username, amount, currency, transactionId) => {
  try {
    const supportEmail = 'support@yourcompany.com'; // Replace with your actual support email
    const replacements = {
      username,
      amount,
      // currency: currency.toUpperCase(),
      currency,
      transactionId,
      supportEmail,
    };

    const htmlContent = replacePlaceholders(SUCCESSFUL_TRANSACTION_TEMPLATE, replacements);

    const mailOptions = {
      from: '"Your Company" <your-email@example.com>', // Replace with your sender email
      to: email,
      subject: 'Payment Confirmation',
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending transaction success email:', error);
    throw new Error(`Error sending transaction success email: ${error.message}`);
  }
};

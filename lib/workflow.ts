import { Client as WorkflowClient } from "@upstash/workflow";

import config from "@/lib/config";
import nodemailer from 'nodemailer';
export const workflowClient = new WorkflowClient({
  baseUrl: config.env.upstash.qstashUrl,
  token: config.env.upstash.qstashToken,
});

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: config.env.gmail.gmailUsername,
    pass: config.env.gmail.gmailPassword,
  },
});

export const sendEmail = async ({
  email,
  subject,
  message,
}: {
  email: string;
  subject: string;
  message: string;
}) => {
  const mailOptions = {
    from: process.env.GMAIL_USERNAME,
    to: [email],
    subject,
    replyTo: email,
    html: `
        
        <div>
        <h1 style="color: teal;">Welcome to MyApp,</h1>
        <p>Hi there, thanks for <b>joining MyApp</b>! We're excited to have you on board.</p>
        <p>Feel free to explore our features and let us know if you have any questions.</p>
        </div>
        <div>
          <p>You have a new message from  (${email}):\n\n${message}</p>
        </div>
    `,
  };
  await transporter.sendMail(mailOptions);

};

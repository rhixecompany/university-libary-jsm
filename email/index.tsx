import { Resend } from 'resend';

import { config } from 'dotenv';
config({ path: '.env.local' });
const resend = new Resend(process.env.RESEND_TOKEN);

// const newe = resend.emails.get('d4f6953b-228b-436e-b64e-20175ee7e150');
// console.log(newe)
// // Welcome Email
const sendEmail = async () => {
  // await resend.emails.send({
  //     from: 'onboarding@resend.dev',
  //     to: 'rhixeero@gmail.com',
  //     subject: 'Hello World',
  //     html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
  // });
  // await resend.domains.create({ name: 'rhixecompany.online' });

  const domains = await resend.domains.list();

  console.log(domains);
  await resend.domains.remove('2ed67cf2-0d3a-411b-97d0-064c58b8b439');
};

sendEmail();

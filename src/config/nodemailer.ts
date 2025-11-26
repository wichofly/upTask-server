import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter;

export const getTransporter = async () => {
  if (!transporter) {
    const testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    console.log('📧 Ethereal account generated:');
    console.log('User:', testAccount.user);
    console.log('Pass:', testAccount.pass);
  }

  return transporter;
};

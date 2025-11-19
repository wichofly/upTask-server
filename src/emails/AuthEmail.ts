import { transporter } from '../config/nodemailer';

interface IEmail {
  email: string;
  name: string;
  token: string;
}

export class AuthEmail {
  static sendConfirmationEmail = async (user: IEmail) => {
    const info = await transporter.sendMail({
      from: '"UpTask" <no-reply@uptask.com>',
      to: user.email,
      subject: 'Confirm your account',
      text: `UpTask - Confirm your account`,
      html: `<p>Please confirm your account <strong>${user.name}</strong> by clicking the following link:</p>
             <a href="http://yourfrontend.com/confirm/">Confirm Account</a>
             <p>Insert the code: <b>${user.token}</b></p>
             <p>This link will expire in 10 minutes.</p>
             `,
    });
    console.log('Email sent', info.messageId);
  };
}

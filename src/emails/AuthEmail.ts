import { getTransporter } from '../config/nodemailer';

interface IEmail {
  email: string;
  name: string;
  token: string;
}

export class AuthEmail {
  static sendConfirmationEmail = async (user: IEmail) => {
    const transporter = await getTransporter();

    if (!process.env.FRONTEND_URL) {
      throw new Error('FRONTEND_URL is not defined in environment variables');
    }

    await transporter.sendMail({
      from: `"UpTask" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Confirm your account',
      text: `UpTask - Confirm your account`,
      html: `<p>Hello <strong>${user.name}</strong>, please confirm your account by clicking the following link:</p>
             <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirm Account</a>
             <p>Insert the code: <b>${user.token}</b></p>
             <p>This link will expire in 10 minutes.</p>
             `,
    });
  };

  static sendPasswordResetToken = async (user: IEmail) => {
    const transporter = await getTransporter();

    if (!process.env.FRONTEND_URL) {
      throw new Error('FRONTEND_URL is not defined in environment variables');
    }

    await transporter.sendMail({
      from: `"UpTask" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Reset your password',
      text: `UpTask - Reset your password`,
      html: `<p>Hello <strong>${user.name}</strong>, please reset your password by clicking the following link:</p>
             <a href="${process.env.FRONTEND_URL}/auth/reset-password">Reset Password</a>
             <p>Insert the code: <b>${user.token}</b></p>
             <p>This link will expire in 10 minutes.</p>
             `,
    });
  };
}

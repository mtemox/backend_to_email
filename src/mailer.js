import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationEmail = async (to, url) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: to,
    subject: 'Verifica tu cuenta - Veedor App',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #03254C; text-align: center;">¡Bienvenido a Veedor App!</h2>
        <p>Hola,</p>
        <p>Para activar tu cuenta y poder ingresar al sistema, por favor verifica tu correo haciendo clic en el siguiente botón:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" style="background-color: #03254C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verificar mi correo</a>
        </div>
        <p>Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:</p>
        <p><a href="${url}">${url}</a></p>
        <p style="color: #888; font-size: 12px; margin-top: 40px; text-align: center;">Si no solicitaste esto, puedes ignorar este correo.</p>
      </div>
    `,
  };
  return transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (to, url) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: to,
    subject: 'Recupera tu contraseña - Veedor App',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #CE1126; text-align: center;">Restablecimiento de Contraseña</h2>
        <p>Hola,</p>
        <p>Hemos recibido una solicitud para restablecer tu contraseña en Veedor App. Haz clic en el botón de abajo para asignar una nueva contraseña:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" style="background-color: #CE1126; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Restablecer mi contraseña</a>
        </div>
        <p>Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:</p>
        <p><a href="${url}">${url}</a></p>
        <p style="color: #888; font-size: 12px; margin-top: 40px; text-align: center;">Si no solicitaste este cambio, por favor ignora este correo. Tu contraseña actual seguirá siendo la misma.</p>
      </div>
    `,
  };
  return transporter.sendMail(mailOptions);
};

import jwt from 'jsonwebtoken';
import { users } from './appwrite.js';
import { Query } from 'node-appwrite';
import { sendVerificationEmail, sendPasswordResetEmail } from './mailer.js';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;

export const sendVerification = async (req, res) => {
  try {
    const { email, userId } = req.body;
    if (!email || !userId) return res.status(400).json({ error: 'Faltan datos' });

    // 1. Crear el token JWT (válido por 24h)
    const token = jwt.sign({ userId, action: 'verify' }, JWT_SECRET, { expiresIn: '24h' });
    
    // 2. Crear URL
    const url = `${FRONTEND_URL}/confirm-email?token=${token}`;

    // 3. Enviar correo
    await sendVerificationEmail(email, url);

    res.json({ message: 'Correo de verificación enviado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al enviar correo' });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Token no proporcionado' });

    // 1. Verificar JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.action !== 'verify') return res.status(400).json({ error: 'Token inválido' });

    // 2. Actualizar usuario en Appwrite usando Server SDK (salta limitación)
    await users.updateEmailVerification(decoded.userId, true);

    res.json({ message: 'Correo verificado exitosamente' });
  } catch (error) {
    console.error(error);
    if (error.name === 'TokenExpiredError') return res.status(400).json({ error: 'El enlace expiró' });
    res.status(500).json({ error: 'Error al verificar correo' });
  }
};

export const sendPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Faltan datos' });

    // 1. Buscar usuario por email en Appwrite
    // El SDK de node permite buscar usuarios
    const userList = await users.list([
      Query.equal("email", [email])
    ]);

    if (userList.total === 0) {
      // Por seguridad, no decimos si existe o no, solo devolvemos éxito
      return res.json({ message: 'Si el correo existe, se enviará el enlace' });
    }

    const userId = userList.users[0].$id;

    // 2. Crear token JWT (válido por 1h)
    const token = jwt.sign({ userId, action: 'reset' }, JWT_SECRET, { expiresIn: '1h' });
    
    // 3. Crear URL
    const url = `${FRONTEND_URL}/reset-password?token=${token}`;

    // 4. Enviar correo
    await sendPasswordResetEmail(email, url);

    res.json({ message: 'Correo de recuperación enviado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al enviar correo' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ error: 'Faltan datos' });

    // 1. Verificar JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.action !== 'reset') return res.status(400).json({ error: 'Token inválido' });

    // 2. Actualizar contraseña en Appwrite
    await users.updatePassword(decoded.userId, password);

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error(error);
    if (error.name === 'TokenExpiredError') return res.status(400).json({ error: 'El enlace expiró' });
    res.status(500).json({ error: 'Error al restablecer contraseña' });
  }
};

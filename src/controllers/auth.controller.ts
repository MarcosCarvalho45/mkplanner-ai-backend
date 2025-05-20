import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Campos obrigatórios faltando' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Usuário já existe' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, phone, password: hashedPassword });
    await user.save();

    return res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro no servidor', error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Credenciais inválidas' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Credenciais inválidas' });

    const token = jwt.sign(
      { userId: user._id, email: user.email, subscription: user.subscription },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.json({ token, user: { name: user.name, email: user.email, subscription: user.subscription } });
  } catch (error) {
    return res.status(500).json({ message: 'Erro no servidor', error });
  }
};

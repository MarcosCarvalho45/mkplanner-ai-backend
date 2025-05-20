import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const register = async (req: Request, res: Response): Promise<any> => {
  const { name, email, phone, password, tenantId } = req.body;

  if (!name || !email || !phone || !password || !tenantId) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: 'Email já registrado' });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
    tenantId,
  });

  const token = jwt.sign({ id: user._id, tenantId: user.tenantId }, JWT_SECRET, { expiresIn: '7d' });

  res.status(201).json({ token });
};

export const login = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Usuário não encontrado' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Senha inválida' });

  const token = jwt.sign({ id: user._id, tenantId: user.tenantId }, JWT_SECRET, { expiresIn: '7d' });

  res.json({ token });
};

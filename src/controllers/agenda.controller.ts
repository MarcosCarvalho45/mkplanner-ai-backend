import { Request, Response } from 'express';
import { Agenda } from '../models/agenda.model';
import { generateAgenda } from '../services/ai.service';

export const createAgendaViaAI = async (req: Request, res: Response) => {
  try {
    const userId = req.userId; // supondo que o middleware JWT já setou isso
    const { prompt, date } = req.body;

    if (!prompt || !date) {
      return res.status(400).json({ message: 'Prompt e data são obrigatórios' });
    }

    const aiResponse = await generateAgenda(prompt);

    // Supondo que a resposta da IA é um texto, você pode parsear ou armazenar diretamente
    const agenda = new Agenda({
      userId,
      title: 'Agenda gerada pela IA',
      description: aiResponse,
      date: new Date(date),
    });

    await agenda.save();

    return res.status(201).json({ message: 'Agenda criada com sucesso', agenda });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar agenda via IA', error });
  }
};

export const listAgendas = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const agendas = await Agenda.find({ userId }).sort({ date: 1 });
    return res.json(agendas);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao listar agendas', error });
  }
};

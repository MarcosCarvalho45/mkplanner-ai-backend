import { Response } from 'express';
import { Agenda, IAgenda } from '../models/agenda.model';
import { gerarAgendaComIA } from '../services/ai.service'; // seu serviço OpenAI
import { AuthenticatedRequest } from '../middlewares/auth.middleware'; // seu tipo estendido

// Cria agenda com geração via IA
export const createAgendaViaAI = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ message: 'Prompt é obrigatório' });
    }

    // Chama o serviço de IA para gerar o texto da agenda
    const textoGerado = await gerarAgendaComIA(prompt);

    if (typeof textoGerado !== 'string') {
      return res.status(500).json({ message: 'Resposta da IA inválida' });
    }

    // Parse seguro do JSON vindo da IA
    let agendaItems: IAgenda[];
    try {
      agendaItems = JSON.parse(textoGerado);
      if (!Array.isArray(agendaItems)) {
        throw new Error('Formato inválido, esperado array de agendas');
      }
    } catch (err) {
      return res.status(500).json({ message: 'Erro ao analisar dados da IA', error: err.message });
    }

    // Salvar cada item de agenda no banco, associando ao usuário
    const agendasCriadas: IAgenda[] = [];
    for (const item of agendaItems) {
      const novaAgenda = new Agenda({
        userId,
        title: item.title,
        description: item.description,
        date: new Date(item.date),
      });
      const salva = await novaAgenda.save();
      agendasCriadas.push(salva);
    }

    return res.status(201).json({ message: 'Agenda criada com sucesso', agendas: agendasCriadas });

  } catch (error) {
    console.error('Erro ao criar agenda via IA:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

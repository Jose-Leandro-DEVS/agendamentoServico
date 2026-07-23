import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from '@prisma/client';

const { PrismaClient } = pkg;
const app = express();
const prisma = new PrismaClient();

// Configuração para lidar com caminhos no ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());

// 👉 ALTERAÇÃO PRINCIPAL: Servir o frontend estático a partir da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// (Mantenha todas as suas rotas /api/... abaixo desta linha normalmente)

// 1. Rota de Teste Básica
app.get('/', (req, res) => {
    res.send('API de Agendamentos rodando com sucesso!');
});

// 2. Rota para Buscar Horários Ocupados (Usada pelo frontend ao selecionar a data)
app.get('/api/agendamentos/horarios-ocupados', async (req, res) => {
    const { data } = req.query; // Exemplo: ?data=2026-07-22

    if (!data) {
        return res.status(400).json({ erro: 'O parâmetro data é obrigatório.' });
    }

    try {
        const agendamentos = await prisma.agendamento.findMany({
            where: { 
                data: data,
                status: { not: 'CANCELADO' } // Ignora agendamentos cancelados para liberar o horário
            },
            select: { horario: true } // Traz apenas a coluna de horário
        });

        const horariosOcupados = agendamentos.map(a => a.horario);
        res.json(horariosOcupados);
    } catch (error) {
        console.error("Erro ao buscar horários:", error);
        res.status(500).json({ erro: 'Erro interno ao buscar horários.' });
    }
});

// 3. Rota para Criar um Novo Agendamento
app.post('/api/agendamentos', async (req, res) => {
    const { nomeCliente, telefone, servico, data, horario } = req.body;

    // Validação básica dos campos obrigatórios
    if (!nomeCliente || !telefone || !servico || !data || !horario) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
    }

    try {
        // Regra de negócio: Verifica se o horário já está ocupado por segurança
        const ocupado = await prisma.agendamento.findFirst({
            where: { 
                data: data, 
                horario: horario, 
                status: { not: 'CANCELADO' } 
            }
        });

        if (ocupado) {
            return res.status(400).json({ erro: 'Este horário já está reservado.' });
        }

        // Salva no banco de dados via Prisma
        const novoAgendamento = await prisma.agendamento.create({
            data: { 
                nomeCliente, 
                telefone, 
                servico, 
                data, 
                horario 
            }
        });

        res.status(201).json(novoAgendamento);
    } catch (error) {
        console.error("Erro ao salvar agendamento:", error);
        res.status(500).json({ erro: 'Erro interno ao salvar agendamento.' });
    }
});

// 4. Rota para Listar/Filtrar Agendamentos (com filtro opcional por ?data=YYYY-MM-DD)
// Exemplo de como deve ficar a rota no seu backend:
app.get('/api/admin/agendamentos', async (req, res) => {
    try {
        const { data } = req.query;
        
        let filtro = {};
        if (data) {
            filtro.data = data;
        }

        const agendamentos = await prisma.agendamento.findMany({
            where: filtro,
            orderBy: [
                { data: 'desc' },   // Datas mais futuras/recentes primeiro
                { horario: 'desc' } // Horários mais tarde primeiro
            ]
        });

        res.json(agendamentos);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar agendamentos" });
    }
});

// 5. Rota para Alterar o Status do Atendimento
app.patch('/api/admin/agendamentos/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'AGENDADO', 'CONFIRMADO', 'CONCLUIDO', 'CANCELADO'

    try {
        const atualizado = await prisma.agendamento.update({
            where: { id: Number(id) },
            data: { status }
        });
        res.json(atualizado);
    } catch (error) {
        console.error("Erro ao atualizar status:", error);
        res.status(500).json({ erro: 'Erro ao atualizar status.' });
    }
});

// 6. Rota para Excluir um Agendamento
app.delete('/api/admin/agendamentos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.agendamento.delete({
            where: { id: Number(id) }
        });
        res.json({ mensagem: 'Agendamento excluído com sucesso.' });
    } catch (error) {
        console.error("Erro ao excluir agendamento:", error);
        res.status(500).json({ erro: 'Erro ao excluir agendamento.' });
    }
});

// Inicia o servidor na porta 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} (http://localhost:${PORT})`);
});
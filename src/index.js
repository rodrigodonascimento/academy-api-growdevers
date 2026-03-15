import express from 'express';
import * as dotenv from 'dotenv';
import { growdevers } from './dados.js';
import { randomUUID } from 'crypto';
import { validateGrowdeverMatriculadoMiddleware, logBody, logMiddleware, logRequestMiddleware, validateGrowdeverMiddleware } from './middlewares.js';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://www.growdev.com.br",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
}));

app.use(logMiddleware);

// GET /growdevers - Listar growdevers
//     /growdevers?idade=20 - query params
app.get("/growdevers", [logRequestMiddleware], (req, res) => {
    const { idade, nome, email } = req.query;

    let dados = growdevers;

    if (idade) {
        dados = dados.filter(item => item.idade >= Number(idade));
    }

    if (nome) {
        dados = dados.filter(item => item.nome.includes(nome));
    }

    if (email) {
        dados = dados.filter(item => item.email === email);
    }

    if (email) {
        dados = dados.filter(item => item.email.includes(email));
    }

    res.status(200).send({
        ok: true,
        mensagem: "Growdevers listados com sucesso",
        // quando a propriedade tem o mesmo nome do valor dixa apenas um deles.
        dados
    });
});

// POST /growdevers - Criar um growdever
app.post("/growdevers", [logBody, validateGrowdeverMiddleware], (req, res) => {
    try {
        // 1 - Entrada
        const body = req.body;

        const novoGrowdever = {
            id: randomUUID(),
            nome: body.nome,
            email: body.email,
            idade: body.idade,
            matriculado: body.matriculado
        };

        // 2 - Processamento
        growdevers.push(novoGrowdever);

        // 3 - saída
        res.status(201).send({
            ok: true,
            mensagem: "Growdever criado com sucesso",
            dados: growdevers
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            mensagem: error.toString()
        });
    }
});

// GET /growdevers/:id - Obter um growdever pelo ID
app.get("/growdevers/:id", [logRequestMiddleware], (req, res) => {
    // 1 - Entrada
    const { id } = req.params;

    // 2- Processamento
    const growdever = growdevers.find((item) => item.id === id);
    if (!growdever) {
        return res.status(404).send({
            ok: false,
            mensagem: "Growdever não encontrado"
        });
    }

    // 3 - Saída
    res.status(200).send({
        ok: true,
        mensagem: "Growdever obtido com sucesso!",
        dados: growdever
    });
});

// PUT /growdevers/:id - Atualizar growdever específico
app.put("/growdevers/:id", [logBody, validateGrowdeverMiddleware, validateGrowdeverMatriculadoMiddleware], (req, res) => {
    try {
        // 1 - Entrada
        const { id } = req.params;
        const { nome, email, idade, matriculado } = req.body || {};

        // 2 - Processamento
        const growdever = growdevers.find(item => item.id === id);
        if (!growdever) {
            return res.status(404).send({
                ok: false,
                mensagem: "Growdever não encontrado"
            });
        }

        growdever.nome = nome;
        growdever.email = email;
        growdever.idade = idade;
        growdever.matriculado = matriculado;

        // 3 - Saída
        res.status(200).send({
            ok: true,
            mensagem: "Growdever atualizado com sucesso",
            dados: growdevers
        });
    } catch (error) {
        res.status(500).send({
            ok: false,
            mensagem: error.toString()
        });
    }
});

// PATCH /growdevers/:id - Toggle (alternar) do campo matriculado
app.patch("/growdevers/:id", (req, res) => {
    // 1 - Entrada
    const { id } = req.params;

    // 2 - Processamento
    const growdever = growdevers.find(item => item.id === id);
    if (!growdever) {
        return res.status(404).send({
            ok: false,
            mensagem: "Growdever não encontrado"
        });
    }

    growdever.matriculado = !growdever.matriculado;

    // 3 - Saída
    res.status(200).send({
        ok: true,
        mensagem: "Growdever atualizado (matriculado) com sucesso",
        dados: growdevers
    });
});

// DELETE /growdevers/:id - Deletar growdever pelo ID
app.delete("/growdevers/:id", (req, res) => {
    // 1 - Entrada
    const { id } = req.params;

    // 2 - Processamento
    const growdeverIndex = growdevers.findIndex(item => item.id === id);
    if (growdeverIndex < 0) {
        return res.status(404).send({
            ok: false,
            mensagem: "Growdever não encontrado"
        });
    }

    growdevers.splice(growdeverIndex, 1);

    // 3 - Saída
    res.status(200).send({
        ok: true,
        mensagem: "Growdever excluído com sucesso",
        dados: growdevers
    });
});

const porta = process.env.PORT;

app.listen(porta, () => {
    console.log("O servidor está executando na porta " + porta);
});
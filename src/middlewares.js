import { log } from "console";
import { growdevers } from './dados.js';

export const logMiddleware = (req, res, next) => {
    console.log("Hellor middleware!!");

    next();
};

export const logRequestMiddleware = (req, res, next) => {
    console.log(req.query);
    console.log(req.hostname);
    console.log(req.ip);
    console.log(req.body);

    next();
};

export const validateGrowdeverMiddleware = (req, res, next) => {
    try {
        const body = req.body;

        if (!body.nome) {
            return res.status(400).send({
                ok: false,
                mensagem: "O campo nome não foi informado"
            });
        }

        if (!body.email) {
            return res.status(400).send({
                ok: false,
                mensagem: "O campo e-mail não foi informado."
            });
        }

        if (!body.idade) {
            return res.status(400).send({
                ok: false,
                mensagem: "O campo idade não foi informado."
            });
        }

        if (Number(body.idade) < 18) {
            return res.status(400).send({
                ok: false,
                mensagem: "O growdever deve ser maior de idade (maior ou igual a 18 anos)."
            });
        }

        next();
    } catch (error) {
        return res.status(500).send({
            ok: false,
            mensagem: error.toString()
        });
    }
};

export const logBody = (req, res, next) => {
    console.log(req.body);
    next();
};

export const validateGrowdeverMatriculadoMiddleware = (req, res, next) => {
    try {
        const { id } = req.params;
        const growdever = growdevers.find(item => item.id === id);

        if (!growdever) {
            return next();
        }

        if (!growdever.matriculado) {
            return res.status(400).send({
                ok: false,
                mensagem: "Growdever não matriculado não pode realizar atualizações"
            });
        }

        next();
    } catch (error) {
        return res.status(500).send({
            ok: false,
            mensagem: `Erro do middleware: ${error.toString()}`
        });
    }
};

// REQUEST ---> ROTA DA API

// REQUEST ---> MIDDLEWARE ---> ROTA DA API
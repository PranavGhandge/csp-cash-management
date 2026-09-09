import { FastifyReply, FastifyRequest } from "fastify";
import peopleTransactionsService from "../service/people-transactions.service";

class PeopleTransactionsController {

    async createTransaction(req: FastifyRequest, reply: FastifyReply) {
        const { person_id, transaction_type, amount, payment_mode, note } = req.body as {
            person_id: string;
            transaction_type: "CREDIT" | "DEBIT";
            amount: number;
            payment_mode: "CASH" | "ONLINE";
            note: string;
        };

        const admin_id = req.user.role === "ADMIN" ? req.user.id : req.user.admin_id;

        if (!admin_id) {
            return reply.status(403).send({
                success: false,
                message: "Admin scope not found"
            });
        }

        const response = await peopleTransactionsService.createTransaction(admin_id, person_id, transaction_type, amount, payment_mode, note);

        return reply.status(201).send(response);
    }


    async getPersonTransactions(req: FastifyRequest, reply: FastifyReply) {

        const { person_id } = req.params as { person_id: string; };

        const admin_id = req.user.role === "ADMIN" ? req.user.id : req.user.admin_id;

        if (!admin_id) {
            return reply.status(403).send({
                success: false,
                message: "Admin scope not found"
            });
        }

        const response = await peopleTransactionsService.getPersonTransactions(admin_id, person_id);

        return reply.status(200).send(response);
    }


    async getAllTransactions(req: FastifyRequest, reply: FastifyReply) {

        const admin_id = req.user.role === "ADMIN" ? req.user.id : req.user.admin_id;

        if (!admin_id) {
            return reply.status(403).send({
                success: false,
                message: "Admin scope not found"
            });
        }

        const response = await peopleTransactionsService.getAllTransactions(admin_id);

        return reply.status(200).send(response);
    }


    async getTransactionById(req: FastifyRequest, reply: FastifyReply) {
        const { id } = req.params as { id: string; };

        const admin_id = req.user.role === "ADMIN" ? req.user.id : req.user.admin_id;

        if (!admin_id) {
            return reply.status(403).send({
                success: false,
                message: "Admin scope not found"
            });
        }

        const response = await peopleTransactionsService.getTransactionById(admin_id, id);

        return reply.status(200).send(response);
    }

    async getSummary(req: FastifyRequest, reply: FastifyReply) {

        const admin_id = req.user.role === "ADMIN" ? req.user.id : req.user.admin_id;

        if (!admin_id) {
            return reply.status(403).send({
                success: false,
                message: "Admin scope not found"
            });
        }

        const response = await peopleTransactionsService.getSummary(admin_id);

        return reply.status(200).send(response);
    }

}

export default new PeopleTransactionsController();
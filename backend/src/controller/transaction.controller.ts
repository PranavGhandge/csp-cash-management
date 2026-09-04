import { FastifyReply, FastifyRequest } from "fastify";
import { ICreateTransaction, ITransactionFilter } from "../interface/transaction.interface";
import transactionService from "../service/transaction.service";
import { createTransactionSchema } from "../utils/validation/transaction.schema";

class TransactionController {

    async createTransaction(req: FastifyRequest, rep: FastifyReply) {
        try {

            const data = createTransactionSchema.parse(req.body);

            const admin_id = req.user.role === "ADMIN" ? req.user.id : req.user.admin_id;

            if (!admin_id) {
                return rep.status(403).send({
                    success: false,
                    message: "Admin scope not found"
                });
            }

            const response = await transactionService.createTransaction(data, admin_id, req.user.id);

            return rep.status(201).send(response);

        } catch (error) {

            return rep.status(500).send({
                success: false,
                message: "Internal server error",
                error: (error as Error).message
            });
        }
    }

    async getAllTransactions(req: FastifyRequest, rep: FastifyReply) {
        try {
            const filter = req.query as ITransactionFilter;

            const admin_id = req.user.role === "ADMIN" ? req.user.id : req.user.admin_id;

            if (!admin_id) {
                return rep.status(403).send({
                    success: false,
                    message: "Admin scope not found"
                });
            }

            const response = await transactionService.getAllTransactions(admin_id, filter);

            return rep.status(200).send(response);

        } catch (error) {
            return rep.status(500).send({
                success: false,
                message: "Internal server error",
                error: (error as Error).message
            });
        }
    }

    async getTransactionById(req: FastifyRequest, rep: FastifyReply) {
        try {
            const { id } = req.params as { id: string };

            const admin_id = req.user.role === "ADMIN" ? req.user.id : req.user.admin_id;

            if (!admin_id) {
                return rep.status(403).send({
                    success: false,
                    message: "Admin scope not found"
                });
            }

            const response = await transactionService.getTransactionById(id, admin_id);

            return rep.status(200).send(response);

        } catch (error) {
            return rep.status(404).send({
                success: false,
                message: (error as Error).message
            });
        }
    }
}

export default new TransactionController();
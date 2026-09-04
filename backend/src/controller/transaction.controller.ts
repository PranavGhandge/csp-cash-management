import { FastifyReply, FastifyRequest } from "fastify";
import { ICreateTransaction } from "../interface/transaction.interface";
import transactionService from "../service/transaction.service";

class TransactionController {

    async createTransaction(req: FastifyRequest, rep: FastifyReply) {
        try {

            const data = req.body as ICreateTransaction;

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
}

export default new TransactionController();
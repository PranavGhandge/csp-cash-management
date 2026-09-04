import { FastifyInstance } from "fastify";
import transactionController from "../controller/transaction.controller";
import authMiddleware from "../middleware/auth.middleware";
import roleMiddleware from "../middleware/role.middleware";

async function TransactionRoutes(fastify: FastifyInstance) {
    fastify.post("/api/transaction", {
        preHandler: [
            authMiddleware,
            roleMiddleware("ADMIN", "OPERATOR")
        ]
    },
        transactionController.createTransaction
    );
}

export default TransactionRoutes;
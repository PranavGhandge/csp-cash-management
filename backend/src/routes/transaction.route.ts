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
    fastify.get("/api/transaction", {
        preHandler: [
            authMiddleware,
            roleMiddleware("ADMIN", "OPERATOR")
        ]
    },
        transactionController.getAllTransactions
    );
    fastify.get("/api/transaction/:id", {
        preHandler: [
            authMiddleware,
            roleMiddleware("ADMIN", "OPERATOR")
        ]
    },
        transactionController.getTransactionById
    );
}

export default TransactionRoutes;
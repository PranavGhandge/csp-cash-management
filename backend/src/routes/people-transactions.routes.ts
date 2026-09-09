import { FastifyInstance } from "fastify";
import peopleTransactionsController from "../controller/people-transactions.controller";
import authMiddleware from "../middleware/auth.middleware";
import roleMiddleware from "../middleware/role.middleware";

export default async function peopleTransactionsRoutes(app: FastifyInstance) {

    app.post(
        "/api/people-transaction", {
        preHandler: [
            authMiddleware,
            roleMiddleware("ADMIN", "OPERATOR")
        ]
    },
        peopleTransactionsController.createTransaction
    );

    app.get(
        "/api/people-transaction", {
        preHandler: [
            authMiddleware,
            roleMiddleware("ADMIN", "OPERATOR")
        ]
    },
        peopleTransactionsController.getAllTransactions
    );

    app.get(
        "/api/people-transaction/summary",
        {
            preHandler: [
                authMiddleware,
                roleMiddleware("ADMIN", "OPERATOR")
            ]
        },
        peopleTransactionsController.getSummary
    );

    app.get("/api/people-transaction/person/:person_id", {
        preHandler: [
            authMiddleware,
            roleMiddleware("ADMIN", "OPERATOR")
        ]
    },
        peopleTransactionsController.getPersonTransactions
    );

    app.get("/api/people-transaction/:id", {
        preHandler: [
            authMiddleware,
            roleMiddleware("ADMIN", "OPERATOR")
        ]
    },
        peopleTransactionsController.getTransactionById
    );
}
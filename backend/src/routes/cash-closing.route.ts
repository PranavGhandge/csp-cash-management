import { FastifyInstance } from "fastify";
import cashClosingController from "../controller/cash-closing.controller";
import authMiddleware from "../middleware/auth.middleware";
import roleMiddleware from "../middleware/role.middleware";

export default async function cashClosingRoutes(
    app: FastifyInstance
) {

    app.post("/api/closing", {
        preHandler: [
            authMiddleware,
            roleMiddleware("ADMIN", "OPERATOR")
        ]
    },
        cashClosingController.createClosing
    );

    app.get("/api/closing", {
        preHandler: [
            authMiddleware,
            roleMiddleware("ADMIN", "OPERATOR")
        ]
    },
        cashClosingController.getAllClosings
    );

    app.get("/api/closing/summary", {
        preHandler: [
            authMiddleware,
            roleMiddleware("ADMIN", "OPERATOR")
        ]
    },
        cashClosingController.getClosingSummary
    );

    app.get("/api/closing/:id", {
        preHandler: [
            authMiddleware,
            roleMiddleware("ADMIN", "OPERATOR")
        ]
    },
        cashClosingController.getClosingById
    );
}
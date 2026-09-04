import { FastifyInstance } from "fastify";
import bankController from "../controller/bank.controller";
import authMiddleware from "../middleware/auth.middleware";
import roleMiddleware from "../middleware/role.middleware";

async function BankRoutes(fastify: FastifyInstance) {
    fastify.post("/api/bank", {
        preHandler: [
            authMiddleware,
            roleMiddleware("ADMIN")
        ]
    },
        bankController.createBank
    );

    fastify.get("/api/bank", {
        preHandler: [
            authMiddleware,
            roleMiddleware("ADMIN")
        ]
    },
        bankController.getAllBanks
    );
}

export default BankRoutes;
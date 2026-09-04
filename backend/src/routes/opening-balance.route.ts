import { FastifyInstance } from "fastify";
import openingBalanceController from "../controller/opening-balance.controller";
import authMiddleware from "../middleware/auth.middleware";
import roleMiddleware from "../middleware/role.middleware";

async function OpeningBalanceRoutes(fastify: FastifyInstance) {
    fastify.post("/api/opening-balance", {
        preHandler: [
            authMiddleware,
            roleMiddleware("ADMIN", "OPERATOR")
        ]
    },
        openingBalanceController.createOpeningBalance
    );
}

export default OpeningBalanceRoutes;
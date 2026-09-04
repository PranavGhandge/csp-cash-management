import { FastifyInstance } from "fastify";
import physicalCashOpeningController from "../controller/physical-cash-opening.controller";
import authMiddleware from "../middleware/auth.middleware";
import roleMiddleware from "../middleware/role.middleware";

async function PhysicalCashOpeningRoutes(fastify: FastifyInstance) {
    fastify.post("/api/physical-cash-opening", {
        preHandler: [
            authMiddleware,
            roleMiddleware("ADMIN", "OPERATOR")
        ]
    },
        physicalCashOpeningController.createOpening
    );
}

export default PhysicalCashOpeningRoutes;
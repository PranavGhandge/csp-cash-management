import { FastifyInstance } from "fastify";
import operatorController from "../controller/operator.controller";
import authMiddleware from "../middleware/auth.middleware";
import roleMiddleware from "../middleware/role.middleware";

async function OperatorRoutes(fastify: FastifyInstance) {

    fastify.post("/api/operator", {
        preHandler: [
            authMiddleware,
            roleMiddleware("ADMIN")
        ]
    },
        operatorController.createOperator
    );

}

export default OperatorRoutes;
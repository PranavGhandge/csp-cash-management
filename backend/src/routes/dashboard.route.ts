import { FastifyInstance } from "fastify";
import dashboardController from "../controller/dashboard.controller";
import authMiddleware from "../middleware/auth.middleware";
import roleMiddleware from "../middleware/role.middleware";

export default async function dashboardRoutes(
    app: FastifyInstance
) {
    app.get(
        "/api/dashboard",
        {
            preHandler: [
                authMiddleware,
                roleMiddleware("ADMIN", "OPERATOR","SUPER_ADMIN")
            ]
        },
        dashboardController.getDashboard
    );
}
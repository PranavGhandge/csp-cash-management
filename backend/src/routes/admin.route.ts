import { FastifyInstance } from "fastify";
import adminController from "../controller/admin.controller";
import authMiddleware from "../middleware/auth.middleware";
import roleMiddleware from "../middleware/role.middleware";

async function AdminRoutes(fastify: FastifyInstance) {

    fastify.post("/api/admin", {
        preHandler: [
            authMiddleware,
            roleMiddleware("SUPER_ADMIN")
        ]
    },
        adminController.createAdmin
    );

}

export default AdminRoutes;
import { FastifyReply, FastifyRequest } from "fastify";
import dashboardService from "../service/dashboard.service";

class DashboardController {

    async getDashboard(
        req: FastifyRequest,
        rep: FastifyReply
    ) {
        const admin_id =
            req.user.role === "ADMIN"
                ? req.user.id
                : req.user.admin_id;

        if (!admin_id) {
            return rep.status(403).send({
                success: false,
                message: "Admin scope not found"
            });
        }

        const response =
            await dashboardService.getDashboard(admin_id);

        return rep.status(200).send(response);
    }
}

export default new DashboardController();
import { FastifyReply, FastifyRequest } from "fastify";
import cashClosingService from "../service/cash-closing.service";
import { createCashClosingSchema } from "../utils/validation/cash-closing.schema";

class CashClosingController {

    async createClosing(req: FastifyRequest, rep: FastifyReply) {

        const data = createCashClosingSchema.parse(req.body);
        const admin_id = req.user.role === "ADMIN" ? req.user.id : req.user.admin_id;

        if (!admin_id) {
            return rep.status(403).send({
                success: false,
                message: "Admin scope not found"
            });
        }

        const response = await cashClosingService.createClosing(data, admin_id, req.user.id);

        return rep.status(201).send(response);
    }

    async getAllClosings(req: FastifyRequest, rep: FastifyReply) {

        const query = req.query as { page?: number; limit?: number; };

        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;

        const admin_id = req.user.role === "ADMIN" ? req.user.id : req.user.admin_id;

        if (!admin_id) {
            return rep.status(403).send({
                success: false,
                message: "Admin scope not found"
            });
        }

        const response = await cashClosingService.getAllClosings(admin_id, page, limit);

        return rep.status(200).send(response);
    }

    async getClosingSummary(
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
            await cashClosingService.getClosingSummary(
                admin_id
            );

        return rep.status(200).send(response);
    }

    async getClosingById(req: FastifyRequest, rep: FastifyReply) {
        const { id } = req.params as { id: string };

        const admin_id = req.user.role === "ADMIN" ? req.user.id : req.user.admin_id;

        if (!admin_id) {
            return rep.status(403).send({
                success: false,
                message: "Admin scope not found"
            });
        }

        const response = await cashClosingService.getClosingById(id, admin_id);

        return rep.status(200).send(response);
    }
}

export default new CashClosingController();
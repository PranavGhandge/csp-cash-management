import { FastifyReply, FastifyRequest } from "fastify";
import { ICreatePhysicalCashOpening } from "../interface/physical-cash-opening.interface";
import physicalCashOpeningService from "../service/physical-cash-opening.service";

class PhysicalCashOpeningController {
    async createOpening(req: FastifyRequest, rep: FastifyReply) {
        const data = req.body as ICreatePhysicalCashOpening;
        const admin_id = req.user.role === "ADMIN" ? req.user.id : req.user.admin_id;

        if (!admin_id) {
            return rep.status(403).send({
                success: false,
                message: "Admin scope not found"
            });
        }

        const response = await physicalCashOpeningService.createOpening(data, admin_id, req.user.id);

        return rep.status(201).send(response);
    }
}

export default new PhysicalCashOpeningController();
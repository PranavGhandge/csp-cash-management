import { FastifyReply, FastifyRequest } from "fastify";
import { ICreateOpeningBalance } from "../interface/opening-balance.interface";
import openingBalanceService from "../service/opening-balance.service";

class OpeningBalanceController {
    async createOpeningBalance(req: FastifyRequest, rep: FastifyReply) {
        try {
            const data = req.body as ICreateOpeningBalance;
            const admin_id = req.user.role === "ADMIN" ? req.user.id : req.user.admin_id;

            if (!admin_id) {
                return rep.status(403).send({
                    success: false,
                    message: "Admin scope not found"
                });
            }

            const response = await openingBalanceService.createOpeningBalance(data, admin_id, req.user.id);

            return rep.status(201).send(response);
        } catch (error) {

            return rep.status(500).send({
                success: false,
                message: "Internal server error",
                error: (error as Error).message
            });
        }
    }
}

export default new OpeningBalanceController();
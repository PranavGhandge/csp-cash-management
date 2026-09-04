import { FastifyReply, FastifyRequest } from "fastify";
import { ICreateBank } from "../interface/bank.interface";
import bankService from "../service/bank.service";

class BankController {
    async createBank(req: FastifyRequest, rep: FastifyReply) {
        try {
            const data = req.body as ICreateBank;
            const admin_id = req.user.id;
            const response = await bankService.createBank(data, admin_id);

            return rep.status(201).send(response);

        } catch (error) {

            return rep.status(500).send({
                success: false,
                message: "Internal server error",
                error: (error as Error).message
            });
        }
    }

    async getAllBanks(req: FastifyRequest, rep: FastifyReply) {
        try {
            const admin_id = req.user.id;
            const response = await bankService.getAllBanks(admin_id);
            return rep.status(200).send(response);

        } catch (error) {

            return rep.status(500).send({
                success: false,
                message: "Internal server error",
                error: (error as Error).message
            });
        }
    }
}

export default new BankController();
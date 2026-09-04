import { FastifyReply, FastifyRequest } from "fastify";
import { ICreateBank } from "../interface/bank.interface";
import bankService from "../service/bank.service";

class BankController {
    async createBank(req: FastifyRequest, rep: FastifyReply) {
        const data = req.body as ICreateBank;
        const admin_id = req.user.id;
        const response = await bankService.createBank(data, admin_id);

        return rep.status(201).send(response);
    }

    async getAllBanks(req: FastifyRequest, rep: FastifyReply) {
        const admin_id = req.user.id;
        const response = await bankService.getAllBanks(admin_id);
        return rep.status(200).send(response);
    }
}

export default new BankController();
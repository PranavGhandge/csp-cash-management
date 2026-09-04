import { FastifyReply, FastifyRequest } from "fastify";
import { ICreateAdmin } from "../interface/admin.interface";
import adminService from "../service/admin.service";

class AdminController {
    async createAdmin(req: FastifyRequest, rep: FastifyReply) {
        const data = req.body as ICreateAdmin;
        const response = await adminService.createAdmin(data);
        return rep.status(201).send(response);
    }
}

export default new AdminController();
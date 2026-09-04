import { FastifyReply, FastifyRequest } from "fastify";
import { ICreateAdmin } from "../interface/admin.interface";
import adminService from "../service/admin.service";

class AdminController {
    async createAdmin(req: FastifyRequest, rep: FastifyReply) {
        try {

            const data = req.body as ICreateAdmin;

            const response = await adminService.createAdmin(data);

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

export default new AdminController();
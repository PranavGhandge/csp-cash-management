import { FastifyReply, FastifyRequest } from "fastify";
import { ICreateUser } from "../interface/user.interface";
import userService from "../service/user.service";

class UserController {
    async createUser(req: FastifyRequest, rep: FastifyReply) {
        try {
            const data = req.body as ICreateUser;
            const responce = await userService.createUser(data)

            return rep.status(201).send(responce)
        } catch (error) {
            return rep.status(500).send({
                success: false,
                message: "Internal server error",
                error: (error as Error).message
            })
        }
    }
}

export default new UserController();
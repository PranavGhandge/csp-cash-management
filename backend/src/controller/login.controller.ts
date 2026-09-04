import { FastifyReply, FastifyRequest } from "fastify";
import { ILoginUser } from "../interface/user.interface";
import loginService from "../service/login.service";

class Login {
    async loginUser(req: FastifyRequest, rep: FastifyReply) {
        const data = req.body as ILoginUser;
        const responce = await loginService.loginUser(data)

        return rep.status(200).send(responce)
    }
}

export default new Login();
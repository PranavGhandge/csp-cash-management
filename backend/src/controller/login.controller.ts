import { FastifyReply, FastifyRequest } from "fastify";
import { ILoginUser } from "../interface/user.interface";
import loginService from "../service/login.service";

class Login{
    async loginUser(req:FastifyRequest , rep:FastifyReply){
        try{
            const data = req.body as ILoginUser;
            const responce = await loginService.loginUser(data)

            return rep.status(200).send(responce)
        }catch(error){
            return rep.status(500).send({
                success:false,
                message:"Internal server error",
                error:(error as Error).message
            })
        }
    }
}

export default new Login();
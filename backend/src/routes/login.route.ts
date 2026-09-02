import { FastifyInstance } from "fastify";
import loginController from "../controller/login.controller";

async function LoginRoutes(fastify:FastifyInstance) {
    fastify.post("/api/login",loginController.loginUser)
}

export default LoginRoutes;
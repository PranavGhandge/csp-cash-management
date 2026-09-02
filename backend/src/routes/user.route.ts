import { FastifyInstance } from "fastify";
import userController from "../controller/user.controller";

async function UserRoutes(fastify:FastifyInstance) {
    fastify.post("/api/createuser",userController.createUser)
}

export default UserRoutes;
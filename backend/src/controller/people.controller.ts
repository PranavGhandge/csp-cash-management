import { FastifyReply, FastifyRequest } from "fastify";
import peopleService from "../service/people.service";

class PeopleController {

    async createPerson(req: FastifyRequest, reply: FastifyReply) {
        const { name, mobile } = req.body as { name: string; mobile?: string | null; };
        const admin_id = req.user.role === "ADMIN" ? req.user.id : req.user.admin_id;

        if (!admin_id) {
            return reply.status(403).send({
                success: false,
                message: "Admin scope not found"
            });
        }

        const response = await peopleService.createPerson(admin_id, name, mobile ?? null);

        return reply.status(201).send(response);
    }


    async getAllPeople(req: FastifyRequest, reply: FastifyReply) {

        const admin_id = req.user.role === "ADMIN" ? req.user.id : req.user.admin_id;

        if (!admin_id) {
            return reply.status(403).send({
                success: false,
                message: "Admin scope not found"
            });
        }

        const response = await peopleService.getAllPeople(admin_id);

        return reply.status(200).send(response);
    }

    async getPersonById(req: FastifyRequest, reply: FastifyReply) {
        const { id } = req.params as { id: string; };

        const admin_id = req.user.role === "ADMIN" ? req.user.id : req.user.admin_id;

        if (!admin_id) {
            return reply.status(403).send({
                success: false,
                message: "Admin scope not found"
            });
        }

        const response = await peopleService.getPersonById(id, admin_id);

        return reply.status(200).send(response);
    }

    async deletePerson(req: FastifyRequest, reply: FastifyReply) {
        const { id } = req.params as { id: string; };

        const admin_id = req.user.role === "ADMIN" ? req.user.id : req.user.admin_id;

        if (!admin_id) {
            return reply.status(403).send({
                success: false,
                message: "Admin scope not found"
            });
        }

        const response = await peopleService.deletePerson(id, admin_id);

        return reply.status(200).send(response);
    }
}

export default new PeopleController();
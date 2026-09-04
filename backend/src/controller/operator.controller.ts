import { FastifyReply, FastifyRequest } from "fastify";
import { ICreateOperator } from "../interface/operator.interface";
import operatorService from "../service/operator.service";

class OperatorController {

    async createOperator(req: FastifyRequest, rep: FastifyReply) {
        try {

            const data = req.body as ICreateOperator;

            const adminId = req.user.id;

            const response =
                await operatorService.createOperator(
                    data,
                    adminId
                );

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

export default new OperatorController();
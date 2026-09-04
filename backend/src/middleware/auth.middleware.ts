import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { ITokenPayload } from "../types/token.type";

const authMiddleware = async (
    req: FastifyRequest,
    rep: FastifyReply
) => {
    try {

        const authorization = req.headers.authorization;

        if (!authorization) {
            return rep.status(401).send({
                success: false,
                message: "Authorization token is required"
            });
        }

        const token = authorization.split(" ")[1];

        if (!token) {
            return rep.status(401).send({
                success: false,
                message: "Invalid authorization format"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as ITokenPayload;

        req.user = decoded;

    } catch (error) {

        return rep.status(401).send({
            success: false,
            message: "Invalid or expired token"
        });

    }
};

export default authMiddleware;
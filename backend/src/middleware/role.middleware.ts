import { FastifyReply, FastifyRequest } from "fastify";

type UserRole = "SUPER_ADMIN" | "ADMIN" | "OPERATOR";

const roleMiddleware = (...allowedRoles: UserRole[]) => {

    return async (
        req: FastifyRequest,
        rep: FastifyReply
    ) => {

        if (!req.user) {
            return rep.status(401).send({
                success: false,
                message: "Unauthorized"
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return rep.status(403).send({
                success: false,
                message: "You do not have permission to access this resource"
            });
        }

    };
};

export default roleMiddleware;
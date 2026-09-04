import { ITokenPayload } from "./token.type";

declare module "fastify" {
    interface FastifyRequest {
        user: ITokenPayload;
    }
}
import { FastifyInstance } from "fastify";
import peopleController from "../controller/people.controller";
import authMiddleware from "../middleware/auth.middleware";
import roleMiddleware from "../middleware/role.middleware";

export default async function peopleRoutes(app: FastifyInstance) {

    app.post("/api/people", {
        preHandler: [
            authMiddleware,
            roleMiddleware("ADMIN", "OPERATOR")
        ]
    },
        peopleController.createPerson
    );

    app.get("/api/people", {
        preHandler: [
            authMiddleware,
            roleMiddleware("ADMIN", "OPERATOR")
        ]
    },
        peopleController.getAllPeople
    );

    app.get("/api/people/:id", {
        preHandler: [
            authMiddleware,
            roleMiddleware("ADMIN", "OPERATOR")
        ]
    },
        peopleController.getPersonById
    );

    app.delete("/api/people/:id", {
        preHandler: [
            authMiddleware,
            roleMiddleware("ADMIN", "OPERATOR")
        ]
    },
        peopleController.deletePerson
    );
}
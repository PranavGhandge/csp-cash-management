import Fastify from "fastify";
import cors from "@fastify/cors";
import sequelize from "./config/database";
import dotenv from "dotenv";
import UserRoutes from "./routes/user.route";
import LoginRoutes from "./routes/login.route";

dotenv.config();

const app = Fastify({ logger: true });

const PORT = Number(process.env.PORT) || 3000;

const start = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database Connected");

        await sequelize.sync();
        console.log("Table created");

        await app.register(cors, {
            origin: [
                "http://localhost:5173",
                "https://login-dev-pranav.up.railway.app",
                "https://deploym-development.up.railway.app"
            ]
        });

        await app.register(UserRoutes);
        await app.register(LoginRoutes);

        await app.listen({
            port: PORT,
            host: "0.0.0.0",
        });

        console.log(`Server Running on Port http://localhost:${PORT}`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

start();
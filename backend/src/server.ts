import Fastify from "fastify";
import cors from "@fastify/cors";
import sequelize from "./config/database";
import dotenv from "dotenv";
import LoginRoutes from "./routes/login.route";
import "./types/fastify";
import AdminRoutes from "./routes/admin.route";
import OperatorRoutes from "./routes/operator.route";
import BankRoutes from "./routes/bank.route";
import OpeningBalanceRoutes from "./routes/opening-balance.route";
import PhysicalCashOpeningRoutes from "./routes/physical-cash-opening.route";
import TransactionRoutes from "./routes/transaction.route";

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

        await app.register(LoginRoutes);
        await app.register(AdminRoutes);
        await app.register(OperatorRoutes);
        await app.register(BankRoutes);
        await app.register(OpeningBalanceRoutes);
        await app.register(PhysicalCashOpeningRoutes);
        await app.register(TransactionRoutes);

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
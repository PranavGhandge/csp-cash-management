import bcrypt from "bcrypt";
import { ICreateOperator } from "../interface/operator.interface";
import operatorRepo from "../repository/operator.repo";
import AppError from "../app-error";

class OperatorService {
    async createOperator(data: ICreateOperator, adminId: string) {
        const checkEmailExist = await operatorRepo.checkEmailExist(data.email);

        if (checkEmailExist) {
            throw new AppError("Email already exists", 409);
        }

        const hashPassword = await bcrypt.hash(data.password, 10);

        const createOperator = await operatorRepo.createOperator(data, hashPassword, adminId);

        return {
            success: true,
            message: "Operator created successfully",
            data: {
                id: createOperator.id,
                first_name: createOperator.first_name,
                last_name: createOperator.last_name,
                email: createOperator.email,
                role: createOperator.role,
                admin_id: createOperator.admin_id
            }
        };
    }
}

export default new OperatorService();
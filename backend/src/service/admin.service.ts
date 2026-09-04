import bcrypt from "bcrypt";
import { ICreateAdmin } from "../interface/admin.interface";
import adminRepo from "../repository/admin.repo";
import AppError from "../app-error";

class AdminService {
    async createAdmin(data: ICreateAdmin) {
        const checkEmailExist = await adminRepo.checkEmailExist(data.email);

        if (checkEmailExist) {
            throw new AppError("Email already exists", 409);
        }

        const hashPassword = await bcrypt.hash(data.password, 10);

        const createAdmin = await adminRepo.createAdmin(data, hashPassword);

        return {
            success: true,
            message: "Admin created successfully",
            data: {
                id: createAdmin.id,
                first_name: createAdmin.first_name,
                last_name: createAdmin.last_name,
                email: createAdmin.email,
                role: createAdmin.role
            }
        };
    }
}

export default new AdminService();
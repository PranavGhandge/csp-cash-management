import bcrypt from "bcrypt";
import { ICreateAdmin } from "../interface/admin.interface";
import adminRepo from "../repository/admin.repo";

class AdminService {
    async createAdmin(data: ICreateAdmin) {
        try {
            const checkEmailExist = await adminRepo.checkEmailExist(data.email);

            if (checkEmailExist) {
                throw new Error("Email already exists");
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

        } catch (error) {
            throw error;
        }
    }
}

export default new AdminService();
import { ILoginUser } from "../interface/user.interface";
import userRepo from "../repository/user.repo";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AppError from "../app-error";

class LoginService {
    async loginUser(data: ILoginUser) {
        const checkEmailExist = await userRepo.checkEmailExist(data.email);

        if (!checkEmailExist) {
            throw new AppError("Email not found", 401);
        }

        if (!checkEmailExist.status) {
            throw new AppError("User is inactive", 403);
        }

        const passwordMatch = await bcrypt.compare(data.password, checkEmailExist.password);

        if (!passwordMatch) {
            throw new AppError("Invalid password", 401);
        }

        const token = jwt.sign(
            {
                id: checkEmailExist.id,
                role: checkEmailExist.role,
                admin_id: checkEmailExist.admin_id
            },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "1d"
            }
        );

        return {
            success: true,
            message: "Login successful",
            data: {
                id: checkEmailExist.id,
                first_name: checkEmailExist.first_name,
                last_name: checkEmailExist.last_name,
                email: checkEmailExist.email,
                role: checkEmailExist.role,
                admin_id: checkEmailExist.admin_id
            },
            token
        };
    }
}

export default new LoginService();
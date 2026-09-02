import { ILoginUser } from "../interface/user.interface";
import userRepo from "../repository/user.repo";
import bcrypt from "bcrypt"

class LoginService {
    async loginUser(data: ILoginUser) {
        try {
            const checkEmailExist = await userRepo.checkEmailExist(data.email);

            if (!checkEmailExist) {
                throw new Error("Email not found")
            }

            const loginUser = await bcrypt.compare(data.password, checkEmailExist.password);

            if (!loginUser) {
                throw new Error("Invalid password")
            }

            return {
                success: true,
                message: "Login successful",
                data: checkEmailExist,
            };
        } catch (error) {
            throw error
        }
    }
}

export default new LoginService();
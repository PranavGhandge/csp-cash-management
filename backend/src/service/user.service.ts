import { ICreateUser } from "../interface/user.interface";
import userRepo from "../repository/user.repo";
import bcrypt from "bcrypt";

class UserService {
    async createUser(data: ICreateUser) {
        try {
            const checkEmailExist = await userRepo.checkEmailExist(data.email);

            if (checkEmailExist) {
                throw new Error("Email already exists")
            }

           const hashpassword= await bcrypt.hash(data.password,10)

            const createUser = await userRepo.createUser(data,hashpassword);

            return {
                success:true,
                message:"User created successfully",
                data:createUser.id
            }
        }catch(error){
            throw error
        }
    }
}

export default new UserService();
import { ICreateUser } from "../interface/user.interface";
import Users from "../model/users.model";

class UserRepository {

    async checkEmailExist(email: string) {
        return await Users.findOne({
            where: {
                email
            }
        });
    }

    async createUser(data: ICreateUser, password: string) {
        return await Users.create({
            ...data,
            password
        });
    }
}

export default new UserRepository();
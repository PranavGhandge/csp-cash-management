import { ICreateAdmin } from "../interface/admin.interface";
import Users from "../model/users.model";

class AdminRepository {
    async checkEmailExist(email: string) {
        return await Users.findOne({ where: { email } });
    }

    async createAdmin(data: ICreateAdmin, password: string) {
        return await Users.create({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            password,
            role: "ADMIN",
            admin_id: null
        });
    }
}

export default new AdminRepository();
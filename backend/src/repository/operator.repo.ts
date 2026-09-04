import { ICreateOperator } from "../interface/operator.interface";
import Users from "../model/users.model";

class OperatorRepository {

    async checkEmailExist(email: string) {
        return await Users.findOne({
            where: {
                email
            }
        });
    }

    async createOperator(data: ICreateOperator, password: string, adminId: string) {
        return await Users.create({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            password,
            role: "OPERATOR",
            admin_id: adminId
        });
    }
}

export default new OperatorRepository();
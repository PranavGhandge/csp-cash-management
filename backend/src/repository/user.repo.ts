import { ICreateUser } from "../interface/user.interface";
import Users from "../model/users.model";

class UserRepository{
    async checkEmailExist(email:string){
        return Users.findOne({where:{email:email}})
    }

    async createUser(data:ICreateUser,password:string){
        return Users.create({...data,password})
    }
}

export default new UserRepository();
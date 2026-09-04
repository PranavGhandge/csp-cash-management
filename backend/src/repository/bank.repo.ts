import { ICreateBank } from "../interface/bank.interface";
import Banks from "../model/banks.model";

class BankRepository {

    async checkCspExist(csp_id: string, admin_id: string) {
        return await Banks.findOne({ where: { csp_id, admin_id } });
    }

    async createBank(data: ICreateBank, admin_id: string) {
        return await Banks.create({
            bank_name: data.bank_name,
            csp_id: data.csp_id,
            admin_id
        });
    }

    async getAllBanks(admin_id: string) {
        return await Banks.findAll({
            where: { admin_id, status: true },
            order: [
                ["created_at", "DESC"]
            ]
        });
    }
}

export default new BankRepository();
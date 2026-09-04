import { ICreateBank } from "../interface/bank.interface";
import bankRepo from "../repository/bank.repo";
import AppError from "../app-error";

class BankService {

    async createBank(data: ICreateBank, admin_id: string) {
        const checkCspExist = await bankRepo.checkCspExist(data.csp_id, admin_id);

        if (checkCspExist) {
            throw new AppError("CSP ID already exists", 409);
        }

        const createBank = await bankRepo.createBank(data, admin_id);

        return {
            success: true,
            message: "Bank created successfully",
            data: {
                id: createBank.id,
                bank_name: createBank.bank_name,
                csp_id: createBank.csp_id,
                admin_id: createBank.admin_id
            }
        };
    }

    async getAllBanks(admin_id: string) {
        const banks = await bankRepo.getAllBanks(admin_id);

        return {
            success: true,
            message: "Banks fetched successfully",
            data: banks
        };
    }
}

export default new BankService();
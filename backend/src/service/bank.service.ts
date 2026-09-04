import { ICreateBank } from "../interface/bank.interface";
import bankRepo from "../repository/bank.repo";

class BankService {

    async createBank(data: ICreateBank, admin_id: string) {
        try {
            const checkCspExist = await bankRepo.checkCspExist(data.csp_id, admin_id);

            if (checkCspExist) {
                throw new Error("CSP ID already exists");
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

        } catch (error) {
            throw error;
        }
    }

    async getAllBanks(admin_id: string) {
        try {
            const banks = await bankRepo.getAllBanks(admin_id);

            return {
                success: true,
                message: "Banks fetched successfully",
                data: banks
            };

        } catch (error) {
            throw error;
        }
    }
}

export default new BankService();
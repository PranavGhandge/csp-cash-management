import { ICreateOpeningBalance } from "../interface/opening-balance.interface";
import openingBalanceRepo from "../repository/opening-balance.repo";

class OpeningBalanceService {
    async createOpeningBalance(data: ICreateOpeningBalance, admin_id: string, created_by: string) {
        try {

            const checkExist = await openingBalanceRepo.checkOpeningBalanceExist(data.bank_id);

            if (checkExist) {
                throw new Error(
                    "Opening balance already exists for this bank and date"
                );
            }

            const bank = await openingBalanceRepo.findBankByAdmin(data.bank_id, admin_id);

            if (!bank) {
                throw new Error("Bank not found");
            }

            const openingBalance = await openingBalanceRepo.createOpeningBalance(data, admin_id, created_by);

            return {
                success: true,
                message: "Opening balance created successfully",
                data: openingBalance
            };

        } catch (error) {
            throw error;
        }
    }
}

export default new OpeningBalanceService();
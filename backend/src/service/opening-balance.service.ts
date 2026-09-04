import { ICreateOpeningBalance } from "../interface/opening-balance.interface";
import openingBalanceRepo from "../repository/opening-balance.repo";
import sequelize from "../config/database";

class OpeningBalanceService {
    async createOpeningBalance(
        data: ICreateOpeningBalance,
        admin_id: string,
        created_by: string
    ) {
        const dbTransaction = await sequelize.transaction();

        try {

            // 1. Check today's opening balance
            const checkExist =
                await openingBalanceRepo.checkOpeningBalanceExist(
                    data.bank_id
                );

            if (checkExist) {
                throw new Error(
                    "Opening balance already exists for this bank and date"
                );
            }

            // 2. Check bank belongs to this admin
            const bank =
                await openingBalanceRepo.findBankByAdmin(
                    data.bank_id,
                    admin_id
                );

            if (!bank) {
                throw new Error("Bank not found");
            }

            // 3. Save opening balance history
            const openingBalance =
                await openingBalanceRepo.createOpeningBalance(
                    data,
                    admin_id,
                    created_by,
                    dbTransaction
                );

            // 4. Update current bank online balance
            bank.online_balance = data.opening_balance;

            await bank.save({
                transaction: dbTransaction
            });

            // 5. Commit
            await dbTransaction.commit();

            return {
                success: true,
                message: "Opening balance created successfully",
                data: openingBalance
            };

        } catch (error) {

            // 6. Rollback
            await dbTransaction.rollback();

            throw error;
        }
    }
}

export default new OpeningBalanceService();
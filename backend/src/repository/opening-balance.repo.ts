import { ICreateOpeningBalance } from "../interface/opening-balance.interface";
import Banks from "../model/banks.model";
import OpeningBalances from "../model/opening-balances.model";

class OpeningBalanceRepository {
    async checkOpeningBalanceExist(bank_id: string) {
        return await OpeningBalances.findOne({
            where: {
                bank_id,
                opening_date: new Date()
            }
        });
    }

    async createOpeningBalance(data: ICreateOpeningBalance, admin_id: string, created_by: string) {
        return await OpeningBalances.create({
            bank_id: data.bank_id,
            opening_balance: data.opening_balance,
            admin_id,
            created_by
        });
    }

    async findBankByAdmin(bank_id: string, admin_id: string) {
        return await Banks.findOne({
            where: {
                id: bank_id,
                admin_id,
                status: true
            }
        });
    }
}

export default new OpeningBalanceRepository();
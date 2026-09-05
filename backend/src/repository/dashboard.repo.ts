import { Op } from "sequelize";
import Transactions from "../model/transactions.model";
import Banks from "../model/banks.model";
import PhysicalCashBalances from "../model/physical-cash-balances.model";
import CashClosings from "../model/cash-closings.model";

class DashboardRepository {

    async getPhysicalCash(admin_id: string) {
        return await PhysicalCashBalances.findOne({
            where: {
                admin_id
            }
        });
    }

    async getBanks(admin_id: string) {
        return await Banks.findAll({
            where: {
                admin_id,
                status: true
            },
            attributes: [
                "id",
                "bank_name",
                "csp_id",
                "online_balance"
            ],
            order: [
                ["bank_name", "ASC"]
            ]
        });
    }

    async getTodayTransactions(
        admin_id: string,
        startDate: Date,
        endDate: Date
    ) {
        return await Transactions.findAll({
            where: {
                admin_id,
                transaction_date: {
                    [Op.gte]: startDate,
                    [Op.lt]: endDate
                }
            },
            attributes: [
                "id",
                "transaction_type",
                "amount"
            ]
        });
    }

    async getLastClosing(admin_id: string) {
        return await CashClosings.findOne({
            where: {
                admin_id
            },
            order: [
                ["closing_date", "DESC"],
                ["created_at", "DESC"]
            ]
        });
    }
}

export default new DashboardRepository();
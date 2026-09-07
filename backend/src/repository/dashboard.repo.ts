import { Op } from "sequelize";
import Transactions from "../model/transactions.model";
import Banks from "../model/banks.model";
import CashClosings from "../model/cash-closings.model";
import PhysicalCashOpenings from "../model/physical-cash-openings.model";
import OpeningBalances from "../model/opening-balances.model";
import TransactionDenominations from "../model/transaction-denominations.model";

class DashboardRepository {

    // =========================================
    // TODAY PHYSICAL CASH OPENING
    // =========================================

    async getTodayPhysicalCashOpening(
        admin_id: string,
        today: string
    ) {
        return await PhysicalCashOpenings.findOne({
            where: {
                admin_id,
                opening_date: today
            },
            order: [
                ["created_at", "DESC"]
            ]
        });
    }


    // =========================================
    // TODAY BANK OPENING BALANCES
    // =========================================

    async getTodayBankOpenings(
        admin_id: string,
        today: string
    ) {
        return await OpeningBalances.findAll({
            where: {
                admin_id,
                opening_date: today
            },
            attributes: [
                "id",
                "bank_id",
                "opening_balance",
                "opening_date"
            ],
            order: [
                ["created_at", "DESC"]
            ]
        });
    }


    // =========================================
    // BANKS
    // =========================================

    async getBanks(admin_id: string) {

        return await Banks.findAll({
            where: {
                admin_id,
                status: true
            },
            attributes: [
                "id",
                "bank_name",
                "csp_id"
            ],
            order: [
                ["bank_name", "ASC"]
            ]
        });
    }


    // =========================================
    // TODAY TRANSACTIONS
    // =========================================

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
                "bank_id",
                "transaction_type",
                "amount"
            ],

            include: [
                {
                    model: TransactionDenominations,
                    as: "denominations",
                    attributes: [
                        "note_500",
                        "note_200",
                        "note_100",
                        "note_50",
                        "note_20",
                        "note_10"
                    ]
                }
            ]
        });
    }


    // =========================================
    // LAST CLOSING
    // =========================================

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
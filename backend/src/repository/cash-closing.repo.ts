import CashClosings from "../model/cash-closings.model";
import CashClosingDenominations from "../model/cash-closing-denominations.model";
import CashClosingBanks from "../model/cash-closing-banks.model";
import Banks from "../model/banks.model";
import { ICreateCashClosing } from "../interface/cash-closing.interface";

class CashClosingRepository {

    async checkClosingExist(admin_id: string, closing_date: string) {
        return await CashClosings.findOne({
            where: {
                admin_id,
                closing_date
            },
        });
    }

    async createClosing(
        data: {
            admin_id: string;
            closing_date: string;
            expected_cash: number;
            actual_cash: number;
            difference: number;
            status: "MATCHED" | "SHORT" | "EXCESS";
            created_by: string;
        },
        transaction: any
    ) {
        return await CashClosings.create(data, {
            transaction
        });
    }

    async createDenominations(closing_id: string, data: ICreateCashClosing, total_amount: number, transaction: any) {
        return await CashClosingDenominations.create(
            {
                closing_id,
                note_500: data.note_500,
                note_200: data.note_200,
                note_100: data.note_100,
                note_50: data.note_50,
                note_20: data.note_20,
                note_10: data.note_10,
                total_amount
            },
            {
                transaction
            }
        );
    }

    async getBanksByAdmin(admin_id: string, transaction: any) {
        return await Banks.findAll({
            where: {
                admin_id,
                status: true
            },
            transaction
        });
    }

    async createBankSnapshot(
        data: {
            closing_id: string;
            bank_id: string;
            bank_name: string;
            csp_id: string;
            opening_balance: number;
            closing_balance: number;
        },
        transaction: any
    ) {
        return await CashClosingBanks.create(
            data,
            {
                transaction
            }
        );
    }

    async getAllClosings(admin_id: string, page: number, limit: number, offset: number) {
        return await CashClosings.findAndCountAll({
            where: {
                admin_id
            },
            distinct: true,
            include: [
                {
                    model: CashClosingDenominations,
                    as: "denominations"
                },
                {
                    model: CashClosingBanks,
                    as: "banks"
                }
            ],
            order: [
                ["closing_date", "DESC"],
                ["created_at", "DESC"]
            ],
            limit,
            offset
        });
    }

    async getClosingById( closing_id: string, admin_id: string) {
        return await CashClosings.findOne({
            where: {
                id: closing_id,
                admin_id
            },
            include: [
                {
                    model: CashClosingDenominations,
                    as: "denominations"
                },
                {
                    model: CashClosingBanks,
                    as: "banks"
                }
            ]
        });
    }
}

export default new CashClosingRepository();
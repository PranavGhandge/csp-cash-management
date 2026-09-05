import CashClosings from "../model/cash-closings.model";
import CashClosingDenominations from "../model/cash-closing-denominations.model";
import PhysicalCashOpenings from "../model/physical-cash-openings.model";
import Transactions from "../model/transactions.model";
import { ICreateCashClosing } from "../interface/cash-closing.interface";
import { Op } from "sequelize";

class CashClosingRepository {

    async checkClosingExist(
        admin_id: string,
        closing_date: string
    ) {
        return await CashClosings.findOne({
            where: {
                admin_id,
                closing_date
            }
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


    async createDenominations(
        closing_id: string,
        data: ICreateCashClosing,
        total_amount: number,
        transaction: any
    ) {
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


    /*
     * Get latest physical cash opening
     */

    async getLatestPhysicalCashOpening(
        admin_id: string
    ) {
        return await PhysicalCashOpenings.findOne({
            where: {
                admin_id
            },
            order: [
                ["opening_date", "DESC"]
            ]
        });
    }


    /*
     * Get today's transactions
     */

    async getTransactionsAfterOpening(
        admin_id: string,
        opening_date: Date
    ) {
        return await Transactions.findAll({
            where: {
                admin_id,
                transaction_date: {
                    [Op.gte]: opening_date
                }
            }
        });
    }


    /*
     * Get all closings
     */

    async getAllClosings(
        admin_id: string,
        page: number,
        limit: number,
        offset: number
    ) {
        return await CashClosings.findAndCountAll({
            where: {
                admin_id
            },
            distinct: true,
            include: [
                {
                    model: CashClosingDenominations,
                    as: "denominations"
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


    /*
     * Get closing by ID
     */

    async getClosingById(
        closing_id: string,
        admin_id: string
    ) {
        return await CashClosings.findOne({
            where: {
                id: closing_id,
                admin_id
            },
            include: [
                {
                    model: CashClosingDenominations,
                    as: "denominations"
                }
            ]
        });
    }
}

export default new CashClosingRepository();
import Transactions from "../model/transactions.model";
import TransactionDenominations from "../model/transaction-denominations.model";
import Banks from "../model/banks.model";
import { Op } from "sequelize";
import { ICreateTransaction, ITransactionFilter } from "../interface/transaction.interface";
import Users from "../model/users.model";

class TransactionRepository {
    async findBank(bank_id: string, admin_id: string) {
        return await Banks.findOne({
            where: { id: bank_id, admin_id, status: true }
        });
    }

    async createTransaction(data: ICreateTransaction, admin_id: string, operator_id: string, transaction: any) {
        return await Transactions.create(
            {
                admin_id,
                bank_id: data.bank_id,
                operator_id,
                customer_name: data.customer_name,
                transaction_type: data.transaction_type,
                amount: data.amount
            },
            { transaction }
        );
    }

    async createDenominations(transaction_id: string, data: ICreateTransaction, transaction: any) {

        const total_amount =
            (500 * data.note_500) +
            (200 * data.note_200) +
            (100 * data.note_100) +
            (50 * data.note_50) +
            (20 * data.note_20) +
            (10 * data.note_10);

        return await TransactionDenominations.create(
            {
                transaction_id,
                note_500: data.note_500,
                note_200: data.note_200,
                note_100: data.note_100,
                note_50: data.note_50,
                note_20: data.note_20,
                note_10: data.note_10,
                total_amount
            },
            { transaction }
        );
    }

    async getAllTransactions(
        admin_id: string,
        filter: ITransactionFilter
    ) {
        const page = Number(filter.page) || 1;
        const limit = Number(filter.limit) || 10;
        const offset = (page - 1) * limit;

        const where: any = {
            admin_id
        };

        // Customer search
        if (filter.search) {
            where.customer_name = {
                [Op.iLike]: `%${filter.search}%`
            };
        }

        // Transaction type
        if (filter.transaction_type) {
            where.transaction_type = filter.transaction_type;
        }

        // Bank filter
        if (filter.bank_id) {
            where.bank_id = filter.bank_id;
        }

        // Date filter
        if (filter.start_date && filter.end_date) {
            where.transaction_date = {
                [Op.between]: [
                    `${filter.start_date} 00:00:00`,
                    `${filter.end_date} 23:59:59`
                ]
            };
        } else if (filter.start_date) {
            where.transaction_date = {
                [Op.gte]: `${filter.start_date} 00:00:00`
            };
        } else if (filter.end_date) {
            where.transaction_date = {
                [Op.lte]: `${filter.end_date} 23:59:59`
            };
        }

        return await Transactions.findAndCountAll({
            where,
            include: [
                {
                    model: Banks,
                    as: "bank",
                    attributes: ["id", "bank_name", "csp_id"]
                },
                {
                    model: TransactionDenominations,
                    as: "denominations"
                },
                {
                    model: Users,
                    as: "operator",
                    attributes: ["id", "first_name", "last_name", "email"]
                }
            ],

            order: [
                ["transaction_date", "DESC"]
            ],

            limit,
            offset
        });
    }

    async getTransactionById(transaction_id: string, admin_id: string) {
        return await Transactions.findOne({
            where: {
                id: transaction_id,
                admin_id
            },
            include: [
                {
                    model: Banks,
                    as: "bank",
                    attributes: ["id", "bank_name", "csp_id"]
                },
                {
                    model: TransactionDenominations,
                    as: "denominations"
                },
                {
                    model: Users,
                    as: "operator",
                    attributes: ["id", "first_name", "last_name", "email"]
                }
            ]
        });
    }
}

export default new TransactionRepository();
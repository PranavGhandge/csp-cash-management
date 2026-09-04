import { ICreateTransaction, ITransactionFilter } from "../interface/transaction.interface";
import transactionRepo from "../repository/transaction.repo";
import sequelize from "../config/database";
import PhysicalCashBalances from "../model/physical-cash-balances.model";
import AppError from "../app-error";

class TransactionService {

    async createTransaction(data: ICreateTransaction, admin_id: string, operator_id: string) {

        const dbTransaction = await sequelize.transaction();

        try {
            const bank = await transactionRepo.findBank(data.bank_id, admin_id);

            if (!bank) {
                throw new AppError("Bank not found", 404);
            }

            const denominationTotal =
                (500 * data.note_500) +
                (200 * data.note_200) +
                (100 * data.note_100) +
                (50 * data.note_50) +
                (20 * data.note_20) +
                (10 * data.note_10);

            if (denominationTotal !== data.amount) {
                throw new AppError(
                    "Denomination total must match transaction amount",
                    400
                );
            }

            const physicalCash =
                await PhysicalCashBalances.findOne({
                    where: {
                        admin_id
                    },
                    transaction: dbTransaction,
                    lock: dbTransaction.LOCK.UPDATE
                });

            if (!physicalCash) {
                throw new AppError(
                    "Physical cash opening not found",
                    404
                );
            }

            if (data.transaction_type === "WITHDRAWAL") {
                if (
                    physicalCash.note_500 < data.note_500 ||
                    physicalCash.note_200 < data.note_200 ||
                    physicalCash.note_100 < data.note_100 ||
                    physicalCash.note_50 < data.note_50 ||
                    physicalCash.note_20 < data.note_20 ||
                    physicalCash.note_10 < data.note_10
                ) throw new AppError(
                    "Insufficient physical cash", 400
                );

                physicalCash.note_500 -= data.note_500;
                physicalCash.note_200 -= data.note_200;
                physicalCash.note_100 -= data.note_100;
                physicalCash.note_50 -= data.note_50;
                physicalCash.note_20 -= data.note_20;
                physicalCash.note_10 -= data.note_10;
                bank.online_balance = Number(bank.online_balance) + data.amount;
            }

            if (data.transaction_type === "DEPOSIT") {

                if (Number(bank.online_balance) < data.amount) throw new AppError(
                    "Insufficient online balance",
                    400
                );

                physicalCash.note_500 += data.note_500;
                physicalCash.note_200 += data.note_200;
                physicalCash.note_100 += data.note_100;
                physicalCash.note_50 += data.note_50;
                physicalCash.note_20 += data.note_20;
                physicalCash.note_10 += data.note_10;

                bank.online_balance = Number(bank.online_balance) - data.amount;
            }

            physicalCash.total_amount =
                (500 * physicalCash.note_500) +
                (200 * physicalCash.note_200) +
                (100 * physicalCash.note_100) +
                (50 * physicalCash.note_50) +
                (20 * physicalCash.note_20) +
                (10 * physicalCash.note_10);

            await physicalCash.save({
                transaction: dbTransaction
            });

            await bank.save({
                transaction: dbTransaction
            });

            const transaction =
                await transactionRepo.createTransaction(
                    data,
                    admin_id,
                    operator_id,
                    dbTransaction
                );

            const denominations =
                await transactionRepo.createDenominations(
                    transaction.id,
                    data,
                    dbTransaction
                );

            await dbTransaction.commit();

            return {
                success: true,
                message: "Transaction created successfully",
                data: {
                    transaction,
                    denominations
                }
            };

        } catch (error) {
            await dbTransaction.rollback();
            throw error;
        }
    }

    async getAllTransactions(admin_id: string, filter: ITransactionFilter) {
        const result = await transactionRepo.getAllTransactions(admin_id, filter);

        const page = Number(filter.page) || 1;
        const limit = Number(filter.limit) || 10;

        const total = result.count;
        const totalPages = Math.ceil(total / limit);

        return {
            success: true,
            message: "Transactions fetched successfully",
            data: result.rows,
            pagination: {
                total,
                page,
                limit,
                totalPages
            }
        };
    }

    async getTransactionById(transaction_id: string, admin_id: string) {

        const transaction = await transactionRepo.getTransactionById(transaction_id, admin_id);

        if (!transaction) {
            throw new AppError(
                "Transaction not found",
                404
            );
        }

        return {
            success: true,
            message: "Transaction fetched successfully",
            data: transaction
        };
    }
}

export default new TransactionService();
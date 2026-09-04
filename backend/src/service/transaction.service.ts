import { ICreateTransaction } from "../interface/transaction.interface";
import transactionRepo from "../repository/transaction.repo";
import sequelize from "../config/database";
import PhysicalCashBalances from "../model/physical-cash-balances.model";

class TransactionService {

    async createTransaction(data: ICreateTransaction, admin_id: string, operator_id: string) {

        const dbTransaction = await sequelize.transaction();

        try {
            const bank = await transactionRepo.findBank(data.bank_id, admin_id);

            if (!bank) {
                throw new Error("Bank not found");
            }

            const denominationTotal =
                (500 * data.note_500) +
                (200 * data.note_200) +
                (100 * data.note_100) +
                (50 * data.note_50) +
                (20 * data.note_20) +
                (10 * data.note_10);

            if (denominationTotal !== data.amount) {
                throw new Error(
                    "Transaction amount and denomination total do not match"
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
                throw new Error(
                    "Physical cash opening balance not found"
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
                ) {
                    throw new Error(
                        "Insufficient physical cash denominations"
                    );
                }

                physicalCash.note_500 -= data.note_500;
                physicalCash.note_200 -= data.note_200;
                physicalCash.note_100 -= data.note_100;
                physicalCash.note_50 -= data.note_50;
                physicalCash.note_20 -= data.note_20;
                physicalCash.note_10 -= data.note_10;

                bank.online_balance = Number(bank.online_balance) + data.amount;
            }

            if (data.transaction_type === "DEPOSIT") {

                if (Number(bank.online_balance) < data.amount) {
                    throw new Error(
                        "Insufficient bank online balance"
                    );
                }

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
}

export default new TransactionService();
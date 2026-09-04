import { ICreateTransaction } from "../interface/transaction.interface";
import Transactions from "../model/transactions.model";
import TransactionDenominations from "../model/transaction-denominations.model";
import Banks from "../model/banks.model";

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
}

export default new TransactionRepository();
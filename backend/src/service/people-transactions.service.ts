import peopleTransactionsRepo from "../repository/people-transactions.repository";
import peopleRepo from "../repository/people.repository";
import AppError from "../app-error";

class PeopleTransactionsService {

    async createTransaction(
        admin_id: string,
        person_id: string,
        transaction_type: "CREDIT" | "DEBIT",
        amount: number,
        payment_mode: "CASH" | "ONLINE",
        note: string | null
    ) {
        if (!admin_id) {
            throw new AppError("Admin scope not found", 403);
        }

        const person = await peopleRepo.findPerson(person_id, admin_id);

        if (!person) {
            throw new AppError("Person not found", 404);
        }

        if (!amount || amount <= 0) {
            throw new AppError("Amount must be greater than 0", 400);
        }

        if (!note || !note.trim()) {
            throw new AppError("Note is required", 400);
        }

        const transaction =
            await peopleTransactionsRepo.createTransaction(
                admin_id,
                person_id,
                transaction_type,
                amount,
                payment_mode,
                note.trim()
            );

        return {
            success: true,
            message: "People ledger transaction created successfully",
            data: transaction
        };
    }

    async getPersonTransactions(
        admin_id: string,
        person_id: string
    ) {
        if (!admin_id) {
            throw new AppError("Admin scope not found", 403);
        }

        const person = await peopleRepo.findPerson(person_id, admin_id);

        if (!person) {
            throw new AppError("Person not found", 404);
        }

        const transactions = await peopleTransactionsRepo.getPersonTransactions(admin_id, person_id);

        return {
            success: true,
            message: "People ledger transaction history fetched successfully",
            data: transactions
        };
    }

    async getAllTransactions(admin_id: string) {

        if (!admin_id) {
            throw new AppError("Admin scope not found", 403);
        }

        const transactions = await peopleTransactionsRepo.getAllTransactions(admin_id);

        return {
            success: true,
            message: "People ledger transactions fetched successfully",
            data: transactions
        };
    }

    async getTransactionById(admin_id: string, transaction_id: string) {

        if (!admin_id) {
            throw new AppError("Admin scope not found", 403);
        }

        const transaction = await peopleTransactionsRepo.getTransactionById(transaction_id, admin_id);

        if (!transaction) {
            throw new AppError("Transaction not found", 404);
        }

        return {
            success: true,
            message: "People ledger transaction fetched successfully",
            data: transaction
        };
    }

    async getSummary(admin_id: string) {

        if (!admin_id) {
            throw new AppError(
                "Admin scope not found",
                403
            );
        }

        const transactions =
            await peopleTransactionsRepo.getSummary(admin_id);

        let totalCredit = 0;
        let totalDebit = 0;

        for (const transaction of transactions) {

            if (transaction.transaction_type === "CREDIT") {
                totalCredit += Number(transaction.amount);
            }

            if (transaction.transaction_type === "DEBIT") {
                totalDebit += Number(transaction.amount);
            }
        }

        const netPosition = totalCredit - totalDebit;

        return {
            success: true,
            message: "People ledger summary fetched successfully",
            data: {
                total_credit: totalCredit,
                total_debit: totalDebit,

                total_to_receive:
                    netPosition > 0 ? netPosition : 0,

                total_to_pay:
                    netPosition < 0 ? Math.abs(netPosition) : 0,

                net_position: netPosition
            }
        };
    }
}

export default new PeopleTransactionsService();
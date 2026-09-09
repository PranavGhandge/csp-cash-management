import PeopleTransactions from "../model/people-transactions.model";
import People from "../model/people.model";

class PeopleTransactionsRepository {

    async createTransaction(
        admin_id: string,
        person_id: string,
        transaction_type: "CREDIT" | "DEBIT",
        amount: number,
        payment_mode: "CASH" | "ONLINE",
        note: string | null
    ) {
        return await PeopleTransactions.create({
            admin_id,
            person_id,
            transaction_type,
            amount,
            payment_mode,
            note
        });
    }

    async getPersonTransactions(admin_id: string, person_id: string) {
        return await PeopleTransactions.findAll({
            where: { admin_id, person_id },
            include: [
                {
                    model: People,
                    as: "person",
                    attributes: ["id", "name", "mobile"]
                }
            ],
            order: [
                ["transaction_date", "DESC"],
                ["created_at", "DESC"]
            ]
        });
    }

    async getAllTransactions(admin_id: string) {
        return await PeopleTransactions.findAll({
            where: { admin_id },
            include: [
                {
                    model: People,
                    as: "person",
                    attributes: ["id", "name", "mobile"]
                }
            ],
            order: [
                ["transaction_date", "DESC"],
                ["created_at", "DESC"]
            ]
        });
    }

    async getTransactionById(transaction_id: string, admin_id: string) {
        return await PeopleTransactions.findOne({
            where: {
                id: transaction_id,
                admin_id
            },
            include: [
                {
                    model: People,
                    as: "person",
                    attributes: ["id", "name", "mobile"]
                }
            ]
        });
    }

    async getSummary(admin_id: string) {
        return await PeopleTransactions.findAll({
            where: {
                admin_id
            },
            attributes: [
                "transaction_type",
                "amount"
            ]
        });
    }
}

export default new PeopleTransactionsRepository();
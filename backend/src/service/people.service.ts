import peopleRepo from "../repository/people.repository";
import AppError from "../app-error";

class PeopleService {

    async createPerson(admin_id: string, name: string, mobile: string | null) {

        if (!admin_id) {
            throw new AppError("Admin scope not found", 403);
        }

        const trimmedName = name.trim();

        if (!trimmedName) {
            throw new AppError("Person name is required", 400);
        }

        const person = await peopleRepo.createPerson(admin_id, trimmedName, mobile);

        return {
            success: true,
            message: "Person created successfully",
            data: person
        };
    }


    async getAllPeople(admin_id: string) {

        if (!admin_id) {
            throw new AppError("Admin scope not found", 403);
        }

        const people = await peopleRepo.getAllPeople(admin_id);

        const data = people.map((person: any) => {

            let totalCredit = 0;
            let totalDebit = 0;

            for (const transaction of person.transactions || []) {

                if (transaction.transaction_type === "CREDIT") {
                    totalCredit += Number(transaction.amount);
                }

                if (transaction.transaction_type === "DEBIT") {
                    totalDebit += Number(transaction.amount);
                }
            }

            const balance = totalCredit - totalDebit;

            return {
                id: person.id,
                name: person.name,
                mobile: person.mobile,
                total_credit: totalCredit,
                total_debit: totalDebit,
                balance,
                status: balance > 0 ? "TO_RECEIVE" : balance < 0 ? "TO_PAY" : "SETTLED"
            };
        });

        return {
            success: true,
            message: "People fetched successfully",
            data
        };
    }

    async getPersonById(person_id: string, admin_id: string) {

        if (!admin_id) {
            throw new AppError("Admin scope not found", 403);
        }

        const person = await peopleRepo.getPersonById(person_id, admin_id);

        if (!person) {
            throw new AppError("Person not found", 404);
        }

        let totalCredit = 0;
        let totalDebit = 0;

        const transactions = (person as any).transactions || [];

        for (const transaction of transactions) {

            if (transaction.transaction_type === "CREDIT") {
                totalCredit += Number(transaction.amount);
            }

            if (transaction.transaction_type === "DEBIT") {
                totalDebit += Number(transaction.amount);
            }
        }

        const balance = totalCredit - totalDebit;

        return {
            success: true,
            message: "Person details fetched successfully",

            data: {
                id: person.id,
                name: person.name,
                mobile: person.mobile,
                total_credit: totalCredit,
                total_debit: totalDebit,
                balance,
                status: balance > 0 ? "TO_RECEIVE" : balance < 0 ? "TO_PAY" : "SETTLED",
                transactions
            }
        };
    }

}

export default new PeopleService();
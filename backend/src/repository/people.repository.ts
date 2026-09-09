import People from "../model/people.model";
import PeopleTransactions from "../model/people-transactions.model";

class PeopleRepository {

    async createPerson(admin_id: string, name: string, mobile: string | null) {
        return await People.create({
            admin_id,
            name,
            mobile
        });
    }

    async getAllPeople(admin_id: string) {
        return await People.findAll({
            where: {
                admin_id,
                status: true
            },
            include: [
                {
                    model: PeopleTransactions,
                    as: "transactions"
                }
            ],
            order: [["created_at", "DESC"]]
        });
    }


    async getPersonById(person_id: string, admin_id: string) {
        return await People.findOne({
            where: {
                id: person_id,
                admin_id,
                status: true
            },
            include: [
                {
                    model: PeopleTransactions,
                    as: "transactions",
                    order: [["transaction_date", "DESC"]]
                }
            ]
        });
    }


    async findPerson(person_id: string, admin_id: string) {
        return await People.findOne({
            where: {
                id: person_id,
                admin_id,
                status: true
            }
        });
    }

}

export default new PeopleRepository();
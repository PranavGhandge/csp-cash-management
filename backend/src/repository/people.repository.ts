import People from "../model/people.model";
import PeopleTransactions from "../model/people-transactions.model";
import sequelize from "../config/database";

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

    async deletePersonWithTransactions(person_id: string, admin_id: string) {
        const t = await sequelize.transaction();
        try {
            await PeopleTransactions.destroy({
                where: {
                    person_id,
                    admin_id
                },
                transaction: t
            });

            await People.destroy({
                where: {
                    id: person_id,
                    admin_id
                },
                transaction: t
            });

            await t.commit();
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

}

export default new PeopleRepository();
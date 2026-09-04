import { ICreatePhysicalCashOpening } from "../interface/physical-cash-opening.interface";
import physicalCashOpeningRepo from "../repository/physical-cash-opening.repo";
import PhysicalCashBalances from "../model/physical-cash-balances.model";
import sequelize from "../config/database";

class PhysicalCashOpeningService {
    async createOpening(data: ICreatePhysicalCashOpening, admin_id: string, created_by: string) {
        const dbTransaction = await sequelize.transaction();
        try {

            const checkExist = await physicalCashOpeningRepo.checkOpeningExist(admin_id);

            if (checkExist) {
                throw new Error(
                    "Physical cash opening already exists for today"
                );
            }

            const total_amount =
                (500 * data.note_500) +
                (200 * data.note_200) +
                (100 * data.note_100) +
                (50 * data.note_50) +
                (20 * data.note_20) +
                (10 * data.note_10);

            const opening = await physicalCashOpeningRepo.createOpening(data, admin_id, created_by, total_amount, dbTransaction);

            const existingBalance = await PhysicalCashBalances.findOne({
                where: { admin_id },
                transaction: dbTransaction,
                lock: dbTransaction.LOCK.UPDATE
            });

            if (existingBalance) {
                existingBalance.note_500 = data.note_500;
                existingBalance.note_200 = data.note_200;
                existingBalance.note_100 = data.note_100;
                existingBalance.note_50 = data.note_50;
                existingBalance.note_20 = data.note_20;
                existingBalance.note_10 = data.note_10;
                existingBalance.total_amount = total_amount;

                await existingBalance.save({
                    transaction: dbTransaction
                });

            } else {

                await PhysicalCashBalances.create(
                    {
                        admin_id,
                        note_500: data.note_500,
                        note_200: data.note_200,
                        note_100: data.note_100,
                        note_50: data.note_50,
                        note_20: data.note_20,
                        note_10: data.note_10,
                        total_amount
                    },
                    {
                        transaction: dbTransaction
                    }
                );
            }

            await dbTransaction.commit();

            return {
                success: true,
                message: "Physical cash opening created successfully",
                data: opening
            };

        } catch (error) {
            await dbTransaction.rollback();
            throw error;
        }
    }
}

export default new PhysicalCashOpeningService();
import { ICreatePhysicalCashOpening } from "../interface/physical-cash-opening.interface";
import physicalCashOpeningRepo from "../repository/physical-cash-opening.repo";

class PhysicalCashOpeningService {
    async createOpening(data: ICreatePhysicalCashOpening, admin_id: string, created_by: string) {
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

            const opening = await physicalCashOpeningRepo.createOpening(data, admin_id, created_by, total_amount);

            return {
                success: true,
                message: "Physical cash opening created successfully",
                data: opening
            };

        } catch (error) {
            throw error;
        }
    }
}

export default new PhysicalCashOpeningService();
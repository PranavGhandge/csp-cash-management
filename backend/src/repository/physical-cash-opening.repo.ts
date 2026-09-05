import { ICreatePhysicalCashOpening } from "../interface/physical-cash-opening.interface";
import PhysicalCashOpenings from "../model/physical-cash-openings.model"

class PhysicalCashOpeningRepository {

    async checkOpeningExist(admin_id: string) {
        return await PhysicalCashOpenings.findOne({
            where: {
                admin_id,
                opening_date: new Date()
            }
        });
    }

    async createOpening( data: ICreatePhysicalCashOpening, admin_id: string, created_by: string, total_amount: number, transaction: any) {
        return await PhysicalCashOpenings.create(
            {
                ...data,
                admin_id,
                created_by,
                total_amount
            },
            {
                transaction
            }
        );
    }
};

export default new PhysicalCashOpeningRepository();
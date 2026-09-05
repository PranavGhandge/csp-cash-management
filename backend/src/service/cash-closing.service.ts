import { ICreateCashClosing } from "../interface/cash-closing.interface";
import cashClosingRepo from "../repository/cash-closing.repo";
import PhysicalCashOpenings from "../model/physical-cash-openings.model";
import Transactions from "../model/transactions.model";
import sequelize from "../config/database";
import AppError from "../app-error";
import { Op } from "sequelize";

class CashClosingService {

    async createClosing(
        data: ICreateCashClosing,
        admin_id: string,
        created_by: string
    ) {
        const dbTransaction = await sequelize.transaction();

        try {

            /*
             * 1. Check today's closing already exists
             */

            const checkExist = await cashClosingRepo.checkClosingExist(
                admin_id,
                new Date().toISOString().split("T")[0]
            );

            if (checkExist) {
                throw new AppError(
                    "Cash closing already exists for today",
                    409
                );
            }


            /*
             * 2. Calculate actual physical cash
             */

            const actualCash =
                (500 * data.note_500) +
                (200 * data.note_200) +
                (100 * data.note_100) +
                (50 * data.note_50) +
                (20 * data.note_20) +
                (10 * data.note_10);


            /*
             * 3. Get latest physical cash opening
             */

            const physicalOpening =
                await PhysicalCashOpenings.findOne({
                    where: {
                        admin_id
                    },
                    order: [
                        ["opening_date", "DESC"]
                    ],
                    transaction: dbTransaction
                });

            if (!physicalOpening) {
                throw new AppError(
                    "Physical cash opening not found",
                    404
                );
            }


            /*
             * 4. Get transactions after physical opening
             */

            const transactions =
                await Transactions.findAll({
                    where: {
                        admin_id,
                        transaction_date: {
                            [Op.gte]:
                                physicalOpening.opening_date
                        }
                    },
                    transaction: dbTransaction
                });


            /*
             * 5. Calculate deposits and withdrawals
             */

            let totalDeposit = 0;
            let totalWithdrawal = 0;

            for (const transaction of transactions) {

                if (
                    transaction.transaction_type ===
                    "DEPOSIT"
                ) {
                    totalDeposit +=
                        Number(transaction.amount);
                }

                if (
                    transaction.transaction_type ===
                    "WITHDRAWAL"
                ) {
                    totalWithdrawal +=
                        Number(transaction.amount);
                }
            }


            /*
             * 6. Calculate expected physical cash
             *
             * Opening Cash
             * + Deposits
             * - Withdrawals
             */

            const expectedCash =
                Number(physicalOpening.total_amount) +
                totalDeposit -
                totalWithdrawal;


            /*
             * 7. Calculate difference
             */

            const difference =
                actualCash - expectedCash;


            /*
             * 8. Determine closing status
             */

            let status:
                "MATCHED" |
                "SHORT" |
                "EXCESS";

            if (difference === 0) {

                status = "MATCHED";

            } else if (difference < 0) {

                status = "SHORT";

            } else {

                status = "EXCESS";
            }


            /*
             * 9. Create cash closing
             */

            const closing =
                await cashClosingRepo.createClosing(
                    {
                        admin_id,
                        closing_date:
                            new Date()
                                .toISOString()
                                .split("T")[0],
                        expected_cash:
                            expectedCash,
                        actual_cash:
                            actualCash,
                        difference,
                        status,
                        created_by
                    },
                    dbTransaction
                );


            /*
             * 10. Save closing denominations
             */

            const denominations =
                await cashClosingRepo.createDenominations(
                    closing.id,
                    data,
                    actualCash,
                    dbTransaction
                );


            /*
             * 11. Commit transaction
             */

            await dbTransaction.commit();


            /*
             * 12. Return closing result
             */

            return {
                success: true,
                message:
                    "Cash closing created successfully",

                data: {
                    closing,
                    denominations
                }
            };

        } catch (error) {

            await dbTransaction.rollback();

            throw error;
        }
    }


    /*
     * Get all cash closings
     */

    async getAllClosings(
        admin_id: string,
        page: number,
        limit: number
    ) {

        const offset =
            (page - 1) * limit;


        const result =
            await cashClosingRepo.getAllClosings(
                admin_id,
                page,
                limit,
                offset
            );


        const total =
            result.count;


        const totalPages =
            Math.ceil(total / limit);


        return {
            success: true,

            message:
                "Cash closings fetched successfully",

            data: result.rows,

            pagination: {
                total,
                page,
                limit,
                totalPages
            }
        };
    }

    async getClosingSummary(admin_id: string) {

        const physicalOpening =
            await cashClosingRepo.getLatestPhysicalCashOpening(
                admin_id
            );

        if (!physicalOpening) {
            throw new AppError(
                "Physical cash opening not found",
                404
            );
        }


        const transactions =
            await cashClosingRepo.getTransactionsAfterOpening(
                admin_id,
                physicalOpening.opening_date
            );


        let totalDeposit = 0;
        let totalWithdrawal = 0;


        for (const transaction of transactions) {

            if (
                transaction.transaction_type ===
                "DEPOSIT"
            ) {
                totalDeposit += Number(
                    transaction.amount
                );
            }


            if (
                transaction.transaction_type ===
                "WITHDRAWAL"
            ) {
                totalWithdrawal += Number(
                    transaction.amount
                );
            }
        }


        const expectedCash =
            Number(physicalOpening.total_amount) +
            totalDeposit -
            totalWithdrawal;


        return {
            success: true,
            message: "Cash closing summary fetched successfully",

            data: {
                physical_opening:
                    Number(physicalOpening.total_amount),

                total_deposit:
                    totalDeposit,

                total_withdrawal:
                    totalWithdrawal,

                expected_cash:
                    expectedCash
            }
        };
    }


    /*
     * Get closing by ID
     */

    async getClosingById(
        closing_id: string,
        admin_id: string
    ) {

        const closing =
            await cashClosingRepo.getClosingById(
                closing_id,
                admin_id
            );


        if (!closing) {

            throw new AppError(
                "Cash closing not found",
                404
            );
        }


        return {
            success: true,

            message:
                "Cash closing fetched successfully",

            data: closing
        };
    }
}


export default new CashClosingService();
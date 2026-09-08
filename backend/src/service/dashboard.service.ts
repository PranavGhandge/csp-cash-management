import dashboardRepo from "../repository/dashboard.repo";
import AppError from "../app-error";

class DashboardService {

    async getDashboard(admin_id: string) {

        if (!admin_id) {
            throw new AppError("Admin scope not found", 403);
        }

        // TODAY DATE

        const today = new Date();

        const todayString =
            today.toISOString().split("T")[0];

        const startDate = new Date(today);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(today);
        endDate.setDate(endDate.getDate() + 1);
        endDate.setHours(0, 0, 0, 0);


        // FETCH TODAY DATA

        const physicalCashOpening =
            await dashboardRepo.getTodayPhysicalCashOpening(
                admin_id,
                todayString
            );

        const bankOpenings =
            await dashboardRepo.getTodayBankOpenings(
                admin_id,
                todayString
            );

        const banks =
            await dashboardRepo.getBanks(admin_id);

        const transactions =
            await dashboardRepo.getTodayTransactions(
                admin_id,
                startDate,
                endDate
            );

        const lastClosing =
            await dashboardRepo.getLastClosing(admin_id);


        // TODAY TRANSACTION CALCULATION

        let totalDeposit = 0;
        let totalWithdrawal = 0;

        for (const transaction of transactions) {

            if (transaction.transaction_type === "DEPOSIT") {
                totalDeposit += Number(transaction.amount);
            }

            if (transaction.transaction_type === "WITHDRAWAL") {
                totalWithdrawal += Number(transaction.amount);
            }
        }

        const transactionCount =
            transactions.length;


        // PHYSICAL CASH OPENING

        const openingCash =
            physicalCashOpening
                ? Number(physicalCashOpening.total_amount)
                : 0;


        // CURRENT PHYSICAL CASH DENOMINATIONS

        let note_500 =
            physicalCashOpening
                ? Number(physicalCashOpening.note_500)
                : 0;

        let note_200 =
            physicalCashOpening
                ? Number(physicalCashOpening.note_200)
                : 0;

        let note_100 =
            physicalCashOpening
                ? Number(physicalCashOpening.note_100)
                : 0;

        let note_50 =
            physicalCashOpening
                ? Number(physicalCashOpening.note_50)
                : 0;

        let note_20 =
            physicalCashOpening
                ? Number(physicalCashOpening.note_20)
                : 0;

        let note_10 =
            physicalCashOpening
                ? Number(physicalCashOpening.note_10)
                : 0;


        // APPLY TRANSACTION DENOMINATIONS

        for (const transaction of transactions) {

            const denominations =
                (transaction as any).denominations;

            if (!denominations) {
                continue;
            }


            if (transaction.transaction_type === "WITHDRAWAL") {

                note_500 -=
                    Number(denominations.note_500 || 0);

                note_200 -=
                    Number(denominations.note_200 || 0);

                note_100 -=
                    Number(denominations.note_100 || 0);

                note_50 -=
                    Number(denominations.note_50 || 0);

                note_20 -=
                    Number(denominations.note_20 || 0);

                note_10 -=
                    Number(denominations.note_10 || 0);
            }


            // DEPOSIT
            // Customer gives notes
            // Physical notes increase

            if (
                transaction.transaction_type ===
                "DEPOSIT"
            ) {

                note_500 +=
                    Number(denominations.note_500 || 0);

                note_200 +=
                    Number(denominations.note_200 || 0);

                note_100 +=
                    Number(denominations.note_100 || 0);

                note_50 +=
                    Number(denominations.note_50 || 0);

                note_20 +=
                    Number(denominations.note_20 || 0);

                note_10 +=
                    Number(denominations.note_10 || 0);
            }
        }


        // CURRENT PHYSICAL CASH TOTAL

        const currentPhysicalCash =
            (500 * note_500) +
            (200 * note_200) +
            (100 * note_100) +
            (50 * note_50) +
            (20 * note_20) +
            (10 * note_10);


        // EXPECTED CASH

        const expectedCash =
            openingCash +
            totalDeposit -
            totalWithdrawal;


        // PHYSICAL CASH RESPONSE

        const physicalCash = {

            total_amount:
                currentPhysicalCash,

            note_500:
                note_500,

            note_200:
                note_200,

            note_100:
                note_100,

            note_50:
                note_50,

            note_20:
                note_20,

            note_10:
                note_10
        };


        // =========================================
        // BANK ONLINE BALANCE
        // =========================================

        const bankData =
            banks.map((bank) => {

                const openingRecord =
                    bankOpenings.find(
                        (opening) =>
                            opening.bank_id === bank.id
                    );

                const openingBalance =
                    openingRecord
                        ? Number(openingRecord.opening_balance)
                        : 0;


                let bankWithdrawal = 0;
                let bankDeposit = 0;


                for (const transaction of transactions) {

                    if (transaction.bank_id !== bank.id) {
                        continue;
                    }

                    if (
                        transaction.transaction_type ===
                        "WITHDRAWAL"
                    ) {
                        bankWithdrawal +=
                            Number(transaction.amount);
                    }

                    if (
                        transaction.transaction_type ===
                        "DEPOSIT"
                    ) {
                        bankDeposit +=
                            Number(transaction.amount);
                    }
                }


                // Withdrawal increases online balance
                // Deposit decreases online balance

                const onlineBalance =
                    openingBalance +
                    bankWithdrawal -
                    bankDeposit;


                return {

                    id:
                        bank.id,

                    bank_name:
                        bank.bank_name,

                    csp_id:
                        bank.csp_id,

                    online_balance:
                        onlineBalance
                };
            });


        // RESPONSE

        return {

            success: true,

            message:
                "Dashboard fetched successfully",

            data: {

                physical_cash:
                    physicalCash,

                banks:
                    bankData,

                today: {

                    total_deposit:
                        totalDeposit,

                    total_withdrawal:
                        totalWithdrawal,

                    transaction_count:
                        transactionCount,

                    expected_cash:
                        expectedCash
                },

                last_closing:
                    lastClosing
                        ? {

                            closing_date:
                                lastClosing.closing_date,

                            expected_cash:
                                Number(
                                    lastClosing.expected_cash
                                ),

                            actual_cash:
                                Number(
                                    lastClosing.actual_cash
                                ),

                            difference:
                                Number(
                                    lastClosing.difference
                                ),

                            status:
                                lastClosing.status
                        }
                        : null
            }
        };
    }
}

export default new DashboardService();
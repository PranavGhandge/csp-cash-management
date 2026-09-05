import dashboardRepo from "../repository/dashboard.repo";
import AppError from "../app-error";

class DashboardService {

    async getDashboard(admin_id: string) {

        if (!admin_id) {
            throw new AppError("Admin scope not found", 403);
        }

        // Today start & tomorrow start
        const today = new Date();

        const startDate = new Date(today);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(today);
        endDate.setDate(endDate.getDate() + 1);
        endDate.setHours(0, 0, 0, 0);

        // Fetch data
        const physicalCash = await dashboardRepo.getPhysicalCash(admin_id);

        if (!physicalCash) {
            throw new AppError("Physical cash balance not found", 404);
        }

        const banks = await dashboardRepo.getBanks(admin_id);

        const transactions = await dashboardRepo.getTodayTransactions(
            admin_id,
            startDate,
            endDate
        );

        const lastClosing = await dashboardRepo.getLastClosing(admin_id);

        // Calculate today's transactions
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

        const transactionCount = transactions.length;

        // Current physical cash
        const currentPhysicalCash = Number(physicalCash.total_amount);

        // Expected cash for today
        const expectedCash =
            currentPhysicalCash - totalDeposit + totalWithdrawal;

        return {
            success: true,
            message: "Dashboard fetched successfully",

            data: {
                physical_cash: {
                    total_amount: currentPhysicalCash,
                    note_500: physicalCash.note_500,
                    note_200: physicalCash.note_200,
                    note_100: physicalCash.note_100,
                    note_50: physicalCash.note_50,
                    note_20: physicalCash.note_20,
                    note_10: physicalCash.note_10
                },

                banks: banks.map((bank) => ({
                    id: bank.id,
                    bank_name: bank.bank_name,
                    csp_id: bank.csp_id,
                    online_balance: Number(bank.online_balance)
                })),

                today: {
                    total_deposit: totalDeposit,
                    total_withdrawal: totalWithdrawal,
                    transaction_count: transactionCount,
                    expected_cash: expectedCash
                },

                last_closing: lastClosing
                    ? {
                        closing_date: lastClosing.closing_date,
                        expected_cash: Number(lastClosing.expected_cash),
                        actual_cash: Number(lastClosing.actual_cash),
                        difference: Number(lastClosing.difference),
                        status: lastClosing.status
                    }
                    : null
            }
        };
    }
}

export default new DashboardService();
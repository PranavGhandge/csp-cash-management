export interface ICreateTransaction {
    bank_id: string;
    customer_name: string;
    transaction_type: "WITHDRAWAL" | "DEPOSIT";
    amount: number;
    note_500: number;
    note_200: number;
    note_100: number;
    note_50: number;
    note_20: number;
    note_10: number;
}

export interface ITransactionFilter {
    page?: number;
    limit?: number;
    search?: string;
    transaction_type?: "WITHDRAWAL" | "DEPOSIT";
    bank_id?: string;
    start_date?: string;
    end_date?: string;
}
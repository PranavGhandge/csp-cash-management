import Transactions from "./transactions.model";
import TransactionDenominations from "./transaction-denominations.model";
import Banks from "./banks.model";
import Users from "./users.model";
import CashClosings from "./cash-closings.model";
import CashClosingBanks from "./cash-closing-banks.model";
import CashClosingDenominations from "./cash-closing-denominations.model";

// Transaction → Denomination
Transactions.hasOne(TransactionDenominations, {
    foreignKey: "transaction_id",
    as: "denominations",
});

// Denomination → Transaction
TransactionDenominations.belongsTo(Transactions, {
    foreignKey: "transaction_id",
    as: "transaction",
});

// Bank → Transactions
Banks.hasMany(Transactions, {
    foreignKey: "bank_id",
    as: "transactions",
});

// Transaction → Bank
Transactions.belongsTo(Banks, {
    foreignKey: "bank_id",
    as: "bank",
});

// Transaction → Operator
Transactions.belongsTo(Users, {
    foreignKey: "operator_id",
    as: "operator",
});

// Operator → Transactions
Users.hasMany(Transactions, {
    foreignKey: "operator_id",
    as: "transactions",
});

// Closing → Denominations
CashClosings.hasOne(CashClosingDenominations, {
    foreignKey: "closing_id",
    as: "denominations"
});

CashClosingDenominations.belongsTo(CashClosings, {
    foreignKey: "closing_id",
    as: "closing"
});

// Closing → Banks Snapshot
CashClosings.hasMany(CashClosingBanks, {
    foreignKey: "closing_id",
    as: "banks"
});

CashClosingBanks.belongsTo(CashClosings, {
    foreignKey: "closing_id",
    as: "closing"
});
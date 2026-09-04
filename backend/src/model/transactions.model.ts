import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Transactions extends Model {
    declare id: string;
    declare admin_id: string;
    declare bank_id: string;
    declare operator_id: string;
    declare customer_name: string;
    declare transaction_type: "WITHDRAWAL" | "DEPOSIT";
    declare amount: number;
    declare transaction_date: Date;
    declare created_at: Date;
    declare updated_at: Date;
}

Transactions.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },

        admin_id: {
            type: DataTypes.UUID,
            allowNull: false
        },

        bank_id: {
            type: DataTypes.UUID,
            allowNull: false
        },

        operator_id: {
            type: DataTypes.UUID,
            allowNull: false
        },

        customer_name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        transaction_type: {
            type: DataTypes.ENUM("WITHDRAWAL", "DEPOSIT"),
            allowNull: false
        },

        amount: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false
        },

        transaction_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },

        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },

        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        sequelize,
        tableName: "transactions",
        timestamps: false
    }
);

export default Transactions;
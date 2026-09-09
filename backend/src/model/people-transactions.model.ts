import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class PeopleTransactions extends Model {
    declare id: string;
    declare admin_id: string;
    declare person_id: string;
    declare transaction_type: "CREDIT" | "DEBIT";
    declare amount: number;
    declare payment_mode: "CASH" | "ONLINE";
    declare transaction_date: Date;
    declare note: string | null;
    declare created_at: Date;
    declare updated_at: Date;
}

PeopleTransactions.init(
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

        person_id: {
            type: DataTypes.UUID,
            allowNull: false
        },

        transaction_type: {
            type: DataTypes.ENUM("CREDIT", "DEBIT"),
            allowNull: false
        },

        amount: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false
        },

        payment_mode: {
            type: DataTypes.ENUM("CASH", "ONLINE"),
            allowNull: false
        },

        transaction_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },

        note: {
            type: DataTypes.TEXT,
            allowNull: true
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
        tableName: "people_transactions",
        timestamps: false
    }
);

export default PeopleTransactions;
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class PhysicalCashBalances extends Model {
    declare id: string;
    declare admin_id: string;
    declare note_500: number;
    declare note_200: number;
    declare note_100: number;
    declare note_50: number;
    declare note_20: number;
    declare note_10: number;
    declare total_amount: number;
    declare updated_at: Date;
}

PhysicalCashBalances.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },

        admin_id: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true
        },

        note_500: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },

        note_200: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },

        note_100: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },

        note_50: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },

        note_20: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },

        note_10: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },

        total_amount: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0
        },

        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        sequelize,
        tableName: "physical_cash_balances",
        timestamps: false
    }
);

export default PhysicalCashBalances;
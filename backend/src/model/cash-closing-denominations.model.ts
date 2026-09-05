import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class CashClosingDenominations extends Model {
    declare id: string;
    declare closing_id: string;
    declare note_500: number;
    declare note_200: number;
    declare note_100: number;
    declare note_50: number;
    declare note_20: number;
    declare note_10: number;
    declare total_amount: number;
    declare created_at: Date;
    declare updated_at: Date;
}

CashClosingDenominations.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },

        closing_id: {
            type: DataTypes.UUID,
            allowNull: false
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
            allowNull: false
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
        tableName: "cash_closing_denominations",
        timestamps: false
    }
);

export default CashClosingDenominations;
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class PhysicalCashOpenings extends Model {
    declare id: string;
    declare admin_id: string;
    declare opening_date: Date;
    declare total_amount: number;
    declare note_500: number;
    declare note_200: number;
    declare note_100: number;
    declare note_50: number;
    declare note_20: number;
    declare note_10: number;
    declare created_by: string;
    declare created_at: Date;
    declare updated_at: Date;
}

PhysicalCashOpenings.init(
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

        opening_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },

        total_amount: {
            type: DataTypes.DECIMAL(15, 2),
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

        created_by: {
            type: DataTypes.UUID,
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
        tableName: "physical_cash_openings",
        timestamps: false
    }
);

export default PhysicalCashOpenings;
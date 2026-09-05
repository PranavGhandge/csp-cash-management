import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class CashClosings extends Model {
    declare id: string;
    declare admin_id: string;
    declare closing_date: Date;
    declare expected_cash: number;
    declare actual_cash: number;
    declare difference: number;
    declare status: "MATCHED" | "SHORT" | "EXCESS";
    declare created_by: string;
    declare created_at: Date;
    declare updated_at: Date;
}

CashClosings.init(
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

        closing_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },

        expected_cash: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false
        },

        actual_cash: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false
        },

        difference: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false
        },

        status: {
            type: DataTypes.ENUM(
                "MATCHED",
                "SHORT",
                "EXCESS"
            ),
            allowNull: false
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
        tableName: "cash_closings",
        timestamps: false
    }
);

export default CashClosings;
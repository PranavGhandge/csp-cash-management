import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class CashClosingBanks extends Model {
    declare id: string;
    declare closing_id: string;
    declare bank_id: string;

    declare bank_name: string;
    declare csp_id: string;

    declare opening_balance: number;
    declare closing_balance: number;

    declare created_at: Date;
    declare updated_at: Date;
}

CashClosingBanks.init(
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

        bank_id: {
            type: DataTypes.UUID,
            allowNull: false
        },

        bank_name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        csp_id: {
            type: DataTypes.STRING,
            allowNull: false
        },

        opening_balance: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false
        },

        closing_balance: {
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
        tableName: "cash_closing_banks",
        timestamps: false
    }
);

export default CashClosingBanks;
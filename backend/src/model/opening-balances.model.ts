import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class OpeningBalances extends Model {
    declare id: string;
    declare admin_id: string;
    declare bank_id: string;
    declare opening_balance: number;
    declare opening_date: Date;
    declare created_by: string;
    declare created_at: Date;
    declare updated_at: Date;
}

OpeningBalances.init(
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

        opening_balance: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false
        },

        opening_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue:DataTypes.NOW
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
        tableName: "opening_balances",
        timestamps: false
    }
);

export default OpeningBalances;
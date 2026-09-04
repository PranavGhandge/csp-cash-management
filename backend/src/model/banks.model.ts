import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Banks extends Model {
    declare id: string;
    declare admin_id: string;
    declare bank_name: string;
    declare csp_id: string;
    declare online_balance: number;
    declare status: boolean;
    declare created_at: Date;
    declare updated_at: Date;
}

Banks.init(
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

        bank_name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        csp_id: {
            type: DataTypes.STRING,
            allowNull: false
        },

        online_balance: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0
        },

        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
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
        tableName: "banks",
        timestamps: false
    }
);

export default Banks;
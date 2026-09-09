import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class People extends Model {
    declare id: string;
    declare admin_id: string;
    declare name: string;
    declare mobile: string | null;
    declare status: boolean;
    declare created_at: Date;
    declare updated_at: Date;
}

People.init(
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

        name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        mobile: {
            type: DataTypes.STRING,
            allowNull: true
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
        tableName: "people",
        timestamps: false
    }
);

export default People;
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Users extends Model {
    declare id: string;
    declare first_name: string;
    declare last_name: string;
    declare email: string;
    declare password: string;
    declare status: boolean;
    declare created_at: Date;
    declare updated_at: Date;
}

Users.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false 
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    }
},

    {
        sequelize,
        tableName: "users",
        timestamps: false
    }
)

export default Users;
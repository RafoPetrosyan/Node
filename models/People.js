import {DataTypes, Model} from "sequelize";
import sequelize from "../services/sequelize.js";

class People extends Model {

}

People.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    middleName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    passport: {
        type: DataTypes.CHAR(9),
        allowNull: false,
        unique: true,
        get: () => undefined,
    },
    voted: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    timestamps: false,
    sequelize,
    tableName: 'people',
    modelName: 'people',
});

export default People;
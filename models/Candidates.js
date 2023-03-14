import {DataTypes, Model} from "sequelize";
import sequelize from "../services/sequelize.js";
import People from "./People.js";

class Candidates extends Model {

}

Candidates.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    votes: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        get: () => undefined,
    },
    number: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
    },
}, {
    timestamps: false,
    sequelize,
    tableName: 'candidates',
    modelName: 'candidates',
});

Candidates.belongsTo(People, {
    foreignKey: 'personId',
    onUpdate: 'cascade',
    onDelete: 'cascade',
    as: 'person',
});

People.hasOne(Candidates, {
    foreignKey: 'personId',
    onUpdate: 'cascade',
    onDelete: 'cascade',
    as: 'candidate',
});

export default Candidates;
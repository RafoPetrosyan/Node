import {DataTypes, Model} from "sequelize";
import sequelize from "../services/sequelize.js";

class Countries extends Model {

}

Countries.init({
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
}, {
  timestamps: false,
  sequelize,
  tableName: 'countries',
  modelName: 'countries',
});

export default Countries;
import {DataTypes, Model} from "sequelize";
import sequelize from "../services/sequelize.js";
import Countries from "./Countries.js";

class Cities extends Model {

}

Cities.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  // region_id: { // todo
  //   type: DataTypes.INTEGER.UNSIGNED,
  //   allowNull: false,
  // },
  country_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
  sequelize,
  tableName: 'cities',
  modelName: 'cities',
})

Cities.belongsTo(Countries, {
  foreignKey: 'country_id',
  as: 'country'
})

Countries.hasMany(Cities, {
  foreignKey: 'country_id',
  as: 'cities',
})

export default Cities;
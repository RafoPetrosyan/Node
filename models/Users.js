import {DataTypes, Model} from "sequelize";
import sequelize from "../services/sequelize.js";
import {hashPassword} from "../helpers/index.js";

class Users extends Model {

}

Users.init({
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
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.CHAR(32),
    allowNull: false,
    set(password) {
      if(password) {
        this.setDataValue('password', hashPassword(password));
      }
    },
    get() {
      return undefined;
    }
  },
  cityId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
  },
}, {
  timestamps: false,
  sequelize,
  tableName: 'users',
  modelName: 'users',
})

export default Users;
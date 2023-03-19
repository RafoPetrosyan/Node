import {DataTypes, Model} from "sequelize";
import sequelize from "../services/sequelize.js";
import Cities from "./Cities.js";
import md5 from "md5";
const {PASSWORD_SECRET} = process.env;

class Users extends Model {
  static hashPassword = (password) => md5(md5(password) + PASSWORD_SECRET);
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
        this.setDataValue('password', Users.hashPassword(password));
      }
    },
    get() {
      return undefined;
    }
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: false,
  sequelize,
  tableName: 'users',
  modelName: 'users',
});


Users.belongsTo(Cities, {
  foreignKey: 'cityId',
  as: 'city'
})

Cities.hasMany(Users, {
  foreignKey: 'cityId',
  as: 'users',
})

Cities.hasOne(Users, {
  foreignKey: 'cityId',
  as: 'user',
})

export default Users;
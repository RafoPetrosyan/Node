import {Sequelize} from "sequelize";

const {MSQL_HOST, MSQL_PORT, MSQL_USER, MSQL_PASSWORD, MSQL_DATABASE} = process.env;

const sequelize = new Sequelize(MSQL_DATABASE, MSQL_USER, MSQL_PASSWORD, {
    host: MSQL_HOST,
    port: MSQL_PORT,
    dialect: 'mysql'
});

export default sequelize;
import mysql from 'mysql2';
import Promise from 'bluebird';
const {MSQL_HOST, MSQL_PORT, MSQL_USER, MSQL_PASSWORD, MSQL_DATABASE} = process.env;

const connection = mysql.createConnection({
    host: MSQL_HOST,
    port: MSQL_PORT,
    user: MSQL_USER,
    password: MSQL_PASSWORD,
    database: MSQL_DATABASE,
    Promise,
});

const db = connection.promise();
export default db;
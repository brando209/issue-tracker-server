const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_SECRET,
    database: 'trackappdb',
});

const makeArray = str => typeof str === "string" && str !== "*" ? [str] : str;

class Database {
    constructor(connection) {
        this.connection = connection;
        this.open();
    }

    open() {
        this.connection.connect((err) => {
            if (err) throw err;
            console.log("Connected to database!");
        })
    }

    async close() {
        await this.connection.close();
    }

    runSqlQuery(sqlQuery) {
        console.log(sqlQuery);
        return new Promise((resolve, reject) => {
            connection.query(sqlQuery, (err, result) => {
                if (err) return reject(err);
                return resolve(JSON.parse(JSON.stringify(result)));
            });
        })
    }

    query(table, columns = "*" || [], rows = "*" || [], options = "*" || [], joinOptions = null) {
        rows = makeArray(rows);
        columns = makeArray(columns);
        options = makeArray(options);
        const SQLRows = rows === "*" ? "" : rows.join(" OR ");
        const SQLColumns = columns === "*" ? columns : columns.join(",");
        const SQLJoin = joinOptions === null ? "" : `INNER JOIN ${joinOptions.joinTable} ON ${joinOptions.joinColumns}`;
        const SQLOptions = options === "*" ? "" : " AND " + options.join(" AND ");
        return this.runSqlQuery(`SELECT ${SQLColumns} FROM ${table} ${SQLJoin} ${rows === "*" && options === "*"? "" : "WHERE"} ${SQLRows}${SQLOptions};`);
    }

    addRecord(table, record) {
        const keys = Object.keys(record);
        const values = Object.values(record);
        return this.runSqlQuery(`INSERT INTO ${table} (${keys.join(", ")}) VALUES ('${values.join("', '")}')`);
    }

    removeRecords(table, rows) {
        rows = makeArray(rows);
        const SQLRows = rows.join(" OR ");
        return this.runSqlQuery(`DELETE FROM ${table} WHERE ${SQLRows}`);
    }

    updateRecords(table, columns, rows) {
        columns = makeArray(columns);
        rows = makeArray(rows);
        return this.runSqlQuery(`UPDATE ${table} SET ${columns.join(", ")} WHERE ${rows.join(" OR ")}`);
    }

}

module.exports = new Database(connection);
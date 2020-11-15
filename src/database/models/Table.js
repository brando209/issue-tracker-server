const db = require('../Database');
const { makeUpdateArray } = require('../utils');

class Table {
    constructor(table, columns) {
        this.tableName = table;
        this.columns = columns;
    }

    async getEntry(columns, rows, joins = null) {
        const result = await db.query(this.tableName, columns, rows, "*", joins)
            .then(data => ({ success: data.length > 0 ? true : false, data: data[0] }))
            .catch(err => ({ success: false, message: err.sqlMessage }));
        return result;
    }

    async getEntrys(columns, rows = "*", joins = null) {
        const result = await db.query(this.tableName, columns, rows, "*", joins)
            .then(data => ({ success: true, data }))
            .catch(err => ({ success: false, message: err.sqlMessage }));
        return result;
    }

    async createEntry(newEntry) {
        const result = await db.addRecord(this.tableName, newEntry)
            .then(data => ({ success: true, id: data.insertId }))
            .catch(err => ({ success: false, message: err.sqlMessage }));
        return result;
    }

    async updateEntrys(rows, updates) {
        const result = await db.updateRecords(this.tableName, makeUpdateArray(updates), rows)
            .then(data => ({ success: true }))
            .catch(err => ({ success: false, message: err.sqlMessage }));
        return result;
    }

    async removeEntrys(rows) {
        const result = await db.removeRecords(this.tableName, rows)
            .then(data => ({ success: true }))
            .catch(err => ({ success: false, message: err.sqlMessage }));
        return result;
    }
}

module.exports = Table;
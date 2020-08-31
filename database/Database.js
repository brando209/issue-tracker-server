const connection = require('../database/connection').getConnection();

class Database {
    #connection;
    constructor(connection) {
        this.#connection = connection;
        this.#connection.connect((err) => {
            if (err) throw err;
            console.log("Connected to database!");
        });
    }

    makeSqlQuery(sqlQuery, data = []) {
        // console.log("sqlqQery: ", sqlQuery);
        // console.log("data: ", data);
        return new Promise((resolve, reject) => {
            connection.query(sqlQuery, data, (err, result) => {
                if (err) return reject(err);
                return resolve(JSON.parse(JSON.stringify(result)));
            });
        })
    };

    async addUser(user) {
        const sqlQuery = "INSERT INTO users (firstName, lastName, userName, email, password) VALUES (?)";
        const values = [user.firstName, user.lastName, user.userName, user.email, user.password];
        const result = await this.makeSqlQuery(sqlQuery, [values]);
        return result.insertId;
    }

    async hasUser(user) {
        if(!user || (!user.email && !user.userName)) { return false; }

        const checkEmail = "SELECT * FROM users WHERE email = ?";
        const checkUsername = "SELECT * FROM users WHERE userName = ?";

        const hasEmail = await this.makeSqlQuery(checkEmail, user.email).then(data => data[0]).catch(err => new Error("checking for user by email"));
        const hasUsername = await this.makeSqlQuery(checkUsername, user.userName).then(data => data[0]).catch(err => new Error("checking for user by userName"));

        if(hasUsername || hasEmail) { return true; }

        return false;
    }
}

module.exports = new Database(connection);
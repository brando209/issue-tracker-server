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
    }

    async addUser(user) {
        const sqlQuery = "INSERT INTO users (firstName, lastName, userName, email, password) VALUES (?)";
        const values = [user.firstName, user.lastName, user.userName, user.email, user.password];
        const result = await this.makeSqlQuery(sqlQuery, [values]);
        return result.insertId;
    }

    //Checks the 'email' and the 'userName' properties of 'user' object against the database
    async hasUser(user) {
        if(!user || (!user.email && !user.userName)) { return false; }

        const usernameQuery = "SELECT * FROM users WHERE userName = ?";
        const emailQuery = "SELECT * FROM users WHERE email = ?";

        // Query database to see if user with same userName exists
        const userWithUsername = await this.makeSqlQuery(usernameQuery, user.userName).then(data => data[0]).catch(err => new Error("checking for user by userName"));
        // Query database to see if user with same email exists
        const userWithEmail = await this.makeSqlQuery(emailQuery, user.email).then(data => data[0]).catch(err => new Error("checking for user by email"));

        //If there is a user which has either the same userName or the same email then return that user object
        if(userWithUsername || userWithEmail) return userWithUsername ? userWithUsername : userWithEmail;  

        return false;
    }
}

module.exports = new Database(connection);
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) return res.status(401).send({ success: false, message: "No auth token"});

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if(err) {
            console.log(err);
            return res.status(403).send({ success: false, message: err});
        }
        req.user = user;
        next();
    }); 
}
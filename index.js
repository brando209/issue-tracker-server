const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const authRouter = require('./src/api/routes/authentication');
const userRouter = require('./src/api/routes/user');
const projectRouter = require('./src/api/routes/projects');

const API_PORT = 3001;

const app = express();

// middlewares
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    if(req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Route Middlewares
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/projects', projectRouter);

app.get('/', (req, res) => {
    res.send("Welcome!");
})

app.listen(process.env.PORT || API_PORT, console.log(`Listening on port ${process.env.PORT || API_PORT}`));
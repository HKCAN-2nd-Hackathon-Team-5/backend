import express from 'express';
import 'dotenv/config';
import bodyParser from 'body-parser';
import databaseConnection from './utility/DatabaseConnection.js';
import authentication from './utility/Authentication.js';
import userauth from './utility/AuthFunc.js';
import studentRouter from "./router/StudentRouter.js";
import applicationRouter from "./router/ApplicationRouter.js";
import autoEmailRouter from "./router/AutoEmailRouter.js";
import courseRouter from "./router/CourseRouter.js";

const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});


databaseConnection(app);
app.use('/api/v1/*', authentication);
app.use('/api/v1/userauth', userauth);
app.use('/api/v1/student', studentRouter);
app.use('/api/v1/application', applicationRouter);
app.use('/api/v1/email', autoEmailRouter);
app.use('/api/v1/course', courseRouter);

const server = app.listen(process.env.PORT, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`Backend server listening at ${host === '::' ? 'http://localhost' : 'https://' + host}:${port}`);
})

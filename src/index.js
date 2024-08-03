import express from 'express';
import 'dotenv/config';
import bodyParser from 'body-parser';
import databaseConnection from './utility/DatabaseConnection.js';
import authentication from './utility/Authentication.js';
import customerRouter from "./router/CustomerRouter.js";
import registrationRouter from "./router/RegistrationRouter.js";
import autoEmailRouter from "./router/AutoEmailRouter.js";
import courseRouter from "./router/CourseRouter.js";

const app = express();
app.use(bodyParser.json());

databaseConnection(app);
app.use('/api/v1/*', authentication);
app.use('/api/v1/customer', customerRouter);
app.use('/api/v1/registration', registrationRouter);
app.use('/api/v1/email', autoEmailRouter);
app.use('/api/v1/course', courseRouter);

const server = app.listen(process.env.PORT, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`Backend server listening at ${host === '::' ? 'http://localhost' : 'https://' + host}:${port}`);
})

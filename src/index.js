import express from 'express';
import bodyParser from 'body-parser';
import databaseConnection from './common/DatabaseConnection.js';
import customerRouter from "./router/CustomerRouter.js";
import registrationRouter from "./router/RegistrationRouter.js";

const app = express();
app.use(bodyParser.json());

databaseConnection(app);
app.use('/api/v1/customer', customerRouter);
app.use('/api/v1/registration', registrationRouter);

const server = app.listen(3008, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`Backend server listening at ${host === '::' ? 'http://localhost' : 'https://' + host}:${port}`);
})

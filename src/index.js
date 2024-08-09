import express from 'express';
import cors from 'cors'
import 'dotenv/config';
import bodyParser from 'body-parser';
import cron from 'node-cron';
import databaseConnection from './utility/DatabaseConnection.js';
import userauth from './utility/AuthFunc.js';
import studentRouter from "./router/StudentRouter.js";
import applicationRouter from "./router/ApplicationRouter.js";
import courseRouter from "./router/CourseRouter.js";
import formRouter from "./router/FormRouter.js";
import paymentRouter from "./router/PaymentRouter.js";
import autoEmailRouter from './router/AutoEmailRouter.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

databaseConnection(app);
app.use('/api/v1/userauth', userauth);
app.use('/api/v1/student', studentRouter);
app.use('/api/v1/application', applicationRouter);
app.use('/api/v1/course', courseRouter);
app.use('/api/v1/form', formRouter);
app.use('/api/v1/payment', paymentRouter);
app.use('/api/v1/auto-email', autoEmailRouter);

const server = app.listen(process.env.PORT, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`Backend server listening at ${host === '::' ? 'http://localhost' : 'https://' + host}:${port}`);
	
	var markPaidTask = cron.schedule('0 35 */1 * * *', () =>  {
		//mark payment every hour
		console.log("markPaidTask was scheduled on " + new Date());
		const url = `${host === '::' ? 'http://localhost' : 'https://' + host}:${port}/api/v1/payment/invoice-check`;
		const markPaid = fetch(url)
		console.log("markPaidTask was executed on " + new Date());
		}, {
		  scheduled: false
	});
	markPaidTask.start();
})

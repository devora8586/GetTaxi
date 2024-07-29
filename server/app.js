import express from 'express';
import cors from "cors";
import { orderRouter } from './Router/orderRouter.js';
import { driverRouter } from './Router/driverRouter.js';
import { companyRouter } from './Router/companyRouter.js';
import { userRouter } from './Router/userRouter.js';
import { logErrors } from './MiddleWare/logErrors.js';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(cookieParser());

app.use('/orders', orderRouter);
app.use('/drivers', driverRouter);
app.use('/users', userRouter);
app.use('/companies', companyRouter);
app.use(logErrors);

app.listen(process.env.SERVER_PORT, (err) => {
    if (err) console.error(err);
    console.log("Server listening on PORT", process.env.SERVER_PORT);
});

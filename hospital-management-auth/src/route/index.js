import express from 'express'
import userRouter from './userRoute.js';
const Router = express.Router();

Router.use('/', userRouter)


export default Router
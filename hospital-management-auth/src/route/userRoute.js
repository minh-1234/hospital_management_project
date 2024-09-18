import express from 'express'
import { userValidation } from '../validation/userValidation.js'
import { otpValidation } from '../validation/otpValidation.js';
import { userController } from '../controller/userController.js'
import { consumerRabbiMQ, subcribeFailedNOtification } from '../util/helper.js';
const userRouter = express.Router();


userRouter.route('/login').post(userValidation.signIn, userController.signIn)
userRouter.route('/auth').post(userController.authMiddleware)
userRouter.route('/register').post(userValidation.signUp, userController.signUp)
userRouter.route('/registerOTP').post(userValidation.signUp, otpValidation.signUp, userController.verifyOtpSignUp)
userRouter.route('/').get(userController.getUser)
userRouter.route('/resetPassword').post(userValidation.updateData, userController.updateData)
userRouter.route('/verifyOtpResetPassword').patch(userValidation.update, userController.update)
userRouter.route('/logout').post(userController.logOut)

consumerRabbiMQ().catch(error => console.error(error))
subcribeFailedNOtification().catch(error => console.error(error))


export default userRouter
import Joi from 'joi'
import { customApiErrorModule } from '../error/customError.js'
import { OTP } from '../util/validators.js'

const signUp = async (req, res, next) => {
  const dataCorrection = Joi.object({
    otp: Joi.string().required().regex(OTP).trim().strict(),
    email: Joi.string().email().required().min(3).max(50)
  })
  try {
    await dataCorrection.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    const errorMessage = new Error(error).message
    const customError = new customApiErrorModule.CustomAPIError(422, errorMessage)
    next(customError)

  }
}
const resetPassword = async (req, res, next) => {
  const dataCorrection = Joi.object({
    email: Joi.string().email().required().min(3).max(50),
    otp: Joi.string().required().regex(OTP).trim().strict()
  })
  try {
    await dataCorrection.validateAsync(req.body, { allowUnknown: true })
    next()
  } catch (error) {
    const errorMessage = new Error(error).message
    const customError = new customApiErrorModule.CustomAPIError(422, errorMessage)
    next(customError)
  }
}

export const otpValidation = {
  signUp,
  resetPassword
}
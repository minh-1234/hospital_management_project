import Joi from 'joi'
import { customApiErrorModule } from '../error/customError.js'
import { DATE_RULE, _ID_RULE, _ID_RULE_MESSAGE } from '../utils/validators.js'

const createNew = async (req, res, next) => {
  const dataCorrection = Joi.object({
    name: Joi.string().required().min(3).max(256).trim().strict(),

    regularMaintenance: Joi.array().items(
      Joi.object({
        dateBegin: Joi.string().regex(DATE_RULE).required(),
        dateEnd: Joi.string().regex(DATE_RULE).required(),
        description: Joi.string().required().min(3).max(2000).trim().strict()
      })
    ).default([])
  })
  try {
    await dataCorrection.validateAsync(req.body, { abortEarly: false })
    next()
    // res.status(200).json('oke')
  } catch (error) {
    const errorMessage = new Error(error).message
    const customError = new customApiErrorModule.CustomAPIError(422, errorMessage)
    next(customError)
  }
}

const update = async (req, res, next) => {
  const dataCorrection = Joi.object({
    name: Joi.string().required().min(3).max(256).trim().strict(),
    regularMaintenance: Joi.array().items(
      Joi.object({
        dateBegin: Joi.string().regex(DATE_RULE).required(),
        dateEnd: Joi.string().regex(DATE_RULE).required(),
        description: Joi.string().required().min(3).max(2000).trim().strict()
      })
    ).default([])
  })
  try {
    await dataCorrection.validateAsync(req.body,
      {
        abortEarly: false,
        allowUnknown: true
      })
    next()
  } catch (error) {
    const errorMessage = new Error(error).message
    const customError = new customApiErrorModule.CustomAPIError(422, errorMessage)
    next(customError)
  }
}
const deleteAnItem = async (req, res, next) => {
  const dataCorrection = Joi.object({
    // id: Joi.string().pattern(_ID_RULE).message(_ID_RULE_MESSAGE)
    id: Joi.string().required()
  })
  try {
    await dataCorrection.validateAsync(req.params, {
      allowUnknown: true
    })
    next()
    // res.status(201).json("Tao thanh cong")
  } catch (error) {
    const errorMessage = new Error(error).message
    const customError = new customApiErrorModule.CustomAPIError(422, errorMessage)
    next(customError)
  }
}
const deleteManyItems = async (req, res, next) => {
  const dataCorrection = Joi.array().items(
    // Joi.string().pattern(_ID_RULE).message(_ID_RULE_MESSAGE)
    Joi.string().required()
  )
  try {
    await dataCorrection.validateAsync(req.body)
    next()
    // res.status(201).json("Tao thanh cong")
  } catch (error) {
    const errorMessage = new Error(error).message
    const customError = new customApiErrorModule.CustomAPIError(422, errorMessage)
    next(customError)
  }
}
export const equipmentValidation = {
  createNew,
  update,
  deleteAnItem,
  deleteManyItems
}
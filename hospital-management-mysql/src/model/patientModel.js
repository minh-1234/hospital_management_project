import Joi from 'joi'
import { connection } from '../config/database.js'
import { PHONE_NUMBER_RULE, _ID_RULE, _ID_RULE_MESSAGE, DATE_RULE, CCCD_RULE } from '../utils/validators.js'
//import { treatProcessModel } from './treatProcessModel.js'

const PATIENT_COLLECTION_SCHEMA = Joi.object({
  id: Joi.string().required(),
  lastMiddleName: Joi.string().required().min(3).max(256).trim().strict(),
  firstName: Joi.string().required().max(256).trim().strict(),
  email: Joi.string().email().required().min(3),
  phoneNum: Joi.string().regex(PHONE_NUMBER_RULE).required(),
  dateOfBirth: Joi.string().regex(DATE_RULE).required(),
  gender: Joi.string().valid('Nam', 'Nữ').required(),
  job: Joi.string().required().min(3).max(256).trim().strict(),
  citizenID: Joi.string().required().pattern(CCCD_RULE),
  height: Joi.string().required().max(256).trim().strict(),
  weight: Joi.string().required().max(256).trim().strict(),
  bloodType: Joi.string().required().max(256).trim().strict(),
  address: Joi.string().required().min(3).max(256).trim().strict(),
  hometown: Joi.string().required().min(3).max(256).trim().strict(),
  diagnosis: Joi.string().required().min(3).max(256).trim().strict(),
  symptoms: Joi.string().min(3).max(256).required(),
  medHistory: Joi.string().min(3).max(256).optional()
})
// const INVALID_DATA_UPDATE = ['_id', 'createdAt']
const validObjectValue = async (data) => {
  return await PATIENT_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}
const createNew = async (Data) => {
  try {
    const validData = await validObjectValue(Data)
    const insertData = JSON.parse(JSON.stringify(validData))
    const sql = "INSERT INTO patients_expl SET ?"
    const newPatient = await connection.promise().query(sql, [insertData])
      .then(([rows, fields]) => {
        return rows
      })
    return insertData
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
const findOneById = async (id) => {
  try {
    // const patientDocs = await getDocs(collection(db, 'patients'));
    const sql = "SELECT * FROM patients_expl WHERE id =?"
    const patient = await connection.promise().query(sql, [id])
      .then(([rows, fields]) => {
        return rows
      })

    return patient
  } catch (error) {
    throw new Error(error)
  }
}
const getAllPatients = async () => {
  try {
    const sql = "SELECT * FROM patients"
    const allPatients = await connection.promise().execute(sql)
      .then(([rows, fields]) => {
        return rows
      })
    return allPatients
  } catch (error) {
    console.error(error)
  }
}
const update = async (updateData, id) => {
  try {
    const sql = "UPDATE patients_expl SET ? WHERE id =?"
    const patient = await connection.promise().query(sql, [updateData, id])
      .then(([rows, fields]) => {
        return rows
      })
    return updateData
  } catch (e) {
    console.error(error)
  }
}
const deleteAnItem = async (id) => {
  try {
    const sql = "DELETE FROM patients_expl WHERE id =?"
    const patient = await connection.promise().query(sql, [id])
      .then(([rows, fields]) => {
        return rows
      })
    return { message: "Delete successfully !" }
  } catch (e) {
    console.error(e)
  }
}
const deleteManyItems = async (arrayItems) => {
  try {
    arrayItems.forEach(async (_id) => {

      await deleteAnItem(_id)
    })
    return { message: "Delete many items successfully !" }
  } catch (e) {
    console.error(e)
  }
}
export const patientModel = {
  createNew,
  PATIENT_COLLECTION_SCHEMA,
  getAllPatients,
  update,
  findOneById,
  deleteAnItem,
  deleteManyItems
}
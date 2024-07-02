//import { patientModel } from '../model/patientModel.js'
import { patientModel } from "../model/patient.js"
import { customApiErrorModule } from "../error/customError.js";
const createNew = async (reqBody) => {
  try {
    const newPatient = await patientModel.createNew(reqBody);
    console.log("Document written: ", newPatient);
    return newPatient
  } catch (e) {
    throw new customApiErrorModule.CustomAPIError(e.statusCode, e.message)
  }
}
const getAllPatients = async () => {
  try {
    const allPatients = await patientModel.getAllPatients();
    return allPatients
  } catch (e) {
    throw new customApiErrorModule.CustomAPIError(e.statusCode, e.message)
  }
}
const findOneById = async (id) => {
  try {
    const Patients = await patientModel.findOneById(id);
    return Patients
  } catch (e) {
    throw new customApiErrorModule.CustomAPIError(e.statusCode, e.message)
  }
}
const update = async (reqBody, id) => {
  try {
    const patientUpdated = await patientModel.findOneById(id)
    if (!patientUpdated) {
      return { message: "Patient is not Exist!" }
    }
    const newPatient = await patientModel.update(reqBody, id);
    return newPatient
  } catch (e) {
    throw new customApiErrorModule.CustomAPIError(e.statusCode, e.message)
  }
}
const deleteAnItem = async (id) => {
  try {
    const targetPatient = await patientModel.findOneById(id)
    if (!targetPatient) {
      console.error("Patient is not Exist !")
      return
    }
    const deletePatient = await patientModel.deleteAnItem(id)
    return deletePatient
  } catch (error) {
    throw new customApiErrorModule.CustomAPIError(e.statusCode, e.message)
  }
}
const deleteManyItems = async (reqBody) => {
  try {
    const arrayItems = await patientModel.deleteManyItems(reqBody)
    return arrayItems
  } catch (error) {
    throw new customApiErrorModule.CustomAPIError(e.statusCode, e.message)
  }
}
export const patientService = {
  createNew,
  getAllPatients,
  update, deleteAnItem,
  deleteManyItems,
  findOneById
}
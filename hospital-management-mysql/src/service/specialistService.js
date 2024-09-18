import { specialistModel } from '../model/specialist.js'
import { customApiErrorModule } from '../error/customError.js';
import { checkCacheAndDb } from '../utils/helper.js';
const createNew = async (reqBody) => {
  try {
    const newSpecialist = await specialistModel.createNew(reqBody);
    return newSpecialist
  } catch (e) {
    throw new customApiErrorModule.CustomAPIError(e.statusCode, e.message)
  }
}
const update = async (reqBody, id) => {
  try {
    const targetSpecialist = await specialistModel.findOneById(id)
    if (!targetSpecialist) {
      return { message: "Specialist is not Exist !" }
    }
    const Specialist = await specialistModel.update(reqBody, id);
    return Specialist
  } catch (e) {
    throw new customApiErrorModule.CustomAPIError(e.statusCode, e.message)
  }
}

const getAllSpecialists = async (position, specialty) => {
  try {
    const allSpecialists = await specialistModel.getAllSpecialists(position, specialty);
    return allSpecialists
  } catch (e) {
    throw new customApiErrorModule.CustomAPIError(e.statusCode, e.message)
  }
}
const deleteAnItem = async (id) => {
  try {
    const targetSpecialist = await specialistModel.findOneById(id)
    if (!targetSpecialist) {
      console.error("NOT FOUND")
      return
    }
    const deleteSpecialist = await specialistModel.deleteAnItem(id)
    return deleteSpecialist
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}
const deleteManyItems = async (reqBody) => {
  try {
    // get all schedules 
    const arrayItems = await specialistModel.deleteManyItems(reqBody)
    return arrayItems
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}
const findOneById = async (id) => {
  try {
    const callBack = async (id) => {
      return await specialistModel.findOneById(id);
    }
    const specialist = await checkCacheAndDb('specialist', id, callBack)
    return specialist
  } catch (e) {
    throw new customApiErrorModule.CustomAPIError(e.statusCode, e.message)
  }
}
export const specialistService = {
  createNew,
  update,
  getAllSpecialists,
  deleteAnItem,
  deleteManyItems,
  findOneById
}
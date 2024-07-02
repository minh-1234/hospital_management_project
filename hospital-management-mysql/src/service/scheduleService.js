
import { scheduleModel } from '../model/schedule.js'

const createNew = async (reqBody, specialistId) => {
  try {
    const newschedule = await scheduleModel.createNew(reqBody, specialistId);
    return newschedule
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
const getAllSchedule = async (specialistId) => {
  try {
    // add new schedule
    const allSchedule = await scheduleModel.getAllSchedule(specialistId);
    return allSchedule
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
const update = async (reqBody, id, specialistId) => {
  try {
    const newSpecialistSchedule = await scheduleModel.update(reqBody, id, specialistId);
    return newSpecialistSchedule
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
const deleteManyItems = async (reqBody, specialistId) => {
  try {
    const arrayItems = await scheduleModel.deleteManyItems(reqBody, specialistId)
    return arrayItems
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}
const deleteAnItem = async (id, specialistId) => {
  try {
    const targetItem = await scheduleModel.findOneById(id, specialistId)
    if (!targetItem) {
      console.error("NOT FOUND")
      return
    }
    const arrayItems = await scheduleModel.deleteAnItem(id, specialistId)
    return arrayItems
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}
export const scheduleService = {
  createNew,
  getAllSchedule,
  update,
  deleteManyItems,
  deleteAnItem

}
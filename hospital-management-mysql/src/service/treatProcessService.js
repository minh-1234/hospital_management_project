//import { treatProcessModel } from '../model/treatProcessModel.js'
import { treatProcessModel } from '../model/treatment_process.js'
import { customApiErrorModule } from '../error/customError.js';
//import { specialistModel } from '../model/specialistModel.js';
const createNew = async (reqBody, patientId) => {
  try {
    // const docRef = await addDoc(collection(db, "users"), req.body);
    const newTreatProcess = await treatProcessModel.createNew(reqBody, patientId);
    console.log("Document written with ID: ", newTreatProcess);
    return newTreatProcess
  } catch (e) {
    throw new customApiErrorModule.CustomAPIError(e.statusCode, e.message)
  }
}
const getAllTreatProcess = async (patientId) => {
  try {
    const allTreatProcess = await treatProcessModel.getAllTreatProcess(patientId)
    const convertData = JSON.parse(JSON.stringify(allTreatProcess))
    const TreatProcesses = convertData.map((data) => {
      const specialistName = data.specialist.lastMiddleName + " " + data.specialist.firstName
      const validData = {
        ...data,
        specialistPosition: data.specialist.position,
        specialistName: specialistName
      };
      return validData;
    });

    return TreatProcesses;
  } catch (e) {
    throw new customApiErrorModule.CustomAPIError(e.statusCode, e.message)
  }
}
const update = async (reqBody, id, patientId) => {
  try {
    const newTreatProcess = await treatProcessModel.update(reqBody, id, patientId);
    return newTreatProcess
  } catch (e) {
    throw new customApiErrorModule.CustomAPIError(e.statusCode, e.message)
  }
}
const deleteAnItem = async (id, patientId) => {
  try {
    const targetTreatProcess = await treatProcessModel.findOneById(id, patientId)
    if (!targetTreatProcess) {
      console.error("Treat process is not Exist !")
      return
    }
    const deleteTreatProcess = await treatProcessModel.deleteAnItem(id, patientId)
    return deleteTreatProcess
  } catch (error) {
    throw new customApiErrorModule.CustomAPIError(e.statusCode, e.message)
  }
}
const deleteManyItems = async (reqBody, patientId) => {
  try {
    const arrayItems = await treatProcessModel.deleteManyItems(reqBody, patientId)
    return arrayItems
  } catch (error) {
    throw new customApiErrorModule.CustomAPIError(e.statusCode, e.message)
  }
}
export const treatProcessService = {
  createNew,
  getAllTreatProcess,
  update, deleteAnItem,
  deleteManyItems
}
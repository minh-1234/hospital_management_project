
import { medicineService } from '../service/medicineService.js'
const createNew = async (req, res, next) => {
  try {
    const newmedicine = await medicineService.createNew(req.body);
    res.status(201).json({ result: 'Đã tạo thành công medicine' })
  } catch (e) {
    console.error("Error adding document: ", e);
  }

}
const getAllMedicines = async (req, res, next) => {
  try {
    const allMedicines = await medicineService.getAllMedicines();
    res.status(201).json(allMedicines)
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
const update = async (req, res, next) => {
  try {
    const id = req.params.id
    const newMedicine = await medicineService.update(req.body, id);
    res.status(201).json(newMedicine)
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
const deleteAnItem = async (req, res, next) => {
  try {
    const id = req.params.id
    const deleteMedicine = await medicineService.deleteAnItem(id)
    res.status(201).json(deleteMedicine)
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}
const deleteManyItems = async (req, res, next) => {
  try {
    const arrayItems = await medicineService.deleteManyItems(req.body)
    res.status(201).json(arrayItems)
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}
export const medicineController = {
  createNew,
  getAllMedicines,
  update,
  deleteAnItem,
  deleteManyItems
}
import { specialistService } from '../service/specialistService.js'


const createNew = async (req, res, next) => {
  try {
    const newSpecialist = await specialistService.createNew(req.body);
    res.status(201).json(newSpecialist)
  } catch (e) {
    console.error("Error adding document: ", e);
  }

}
const update = async (req, res, next) => {
  try {
    const id = req.params.id
    const newSpecialist = await specialistService.update(req.body, id);
    res.status(201).json(newSpecialist)
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

const getAllSpecialists = async (req, res, next) => {
  try {
    const position = req.query.position
    const specialty = req.query.specialty
    const allSpecialists = await specialistService.getAllSpecialists(position, specialty);
    res.status(201).json(allSpecialists)
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
const findOneById = async (req, res, next) => {
  try {

    const idSpecialist = req.params.id
    const specialist = await specialistService.findOneById(idSpecialist);
    res.status(201).json(specialist)
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
const deleteAnItem = async (req, res, next) => {
  try {
    const id = req.params.id
    const deleteSpecialist = await specialistService.deleteAnItem(id)
    res.status(201).json(deleteSpecialist)
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}
const deleteManyItems = async (req, res, next) => {
  try {
    const arrayItems = await specialistService.deleteManyItems(req.body)
    res.status(201).json(arrayItems)
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}
export const specialistController = {
  createNew,
  update,
  getAllSpecialists,
  deleteAnItem,
  deleteManyItems,
  findOneById
}
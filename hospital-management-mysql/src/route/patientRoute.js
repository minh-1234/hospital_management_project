import express from 'express'
import { patientController } from '../controller/patientController.js'
import { patientValidation } from '../validations/patientValidation.js'
import { authMiddlewareRole, authMiddlewareLogin } from '../middleware/authMiddleware.js'
import treatProcessRouter from './treatProcessRoute.js'

const patientRouter = express.Router();


patientRouter.route('/')
  .get(patientController.getAllPatients)
  .post(patientValidation.createNew, authMiddlewareLogin, authMiddlewareRole, patientController.createNew)
patientRouter.route('/deleteMany')
  .put(patientValidation.deleteManyItems, patientController.deleteManyItems)
patientRouter.route('/:id')
  .get(patientController.findOneById)
  .delete(patientValidation.deleteAnItem, patientController.deleteAnItem)
patientRouter.route('/updateInfo/:id')
  .patch(patientValidation.updatePatientInfo, patientController.update)
patientRouter.route('/updateInfoMedical/:id')
  .patch(patientValidation.updatePatientInfoMedical, patientController.update)
patientRouter.use('/:patientId/treatProcess', treatProcessRouter)
export default patientRouter
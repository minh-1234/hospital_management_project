import express from 'express'
import { treatProcessController } from '../controller/treatProcessController.js'
import { treatProcessValidation } from '../validations/treatProcessValidation.js'
//import { authMiddlewareRole, authMiddlewareLogin } from '../middleware/authMiddleware.js'
const treatProcessRouter = express.Router({ mergeParams: true });


treatProcessRouter.route('/')
  .get(treatProcessController.getAllTreatProcess)
  .post(treatProcessValidation.createNew, treatProcessController.createNew)
treatProcessRouter.route('/deleteMany')
  .put(treatProcessValidation.deleteManyItems, treatProcessController.deleteManyItems)
treatProcessRouter.route('/:id')
  .put(treatProcessValidation.update, treatProcessController.update)
  .delete(treatProcessValidation.deleteAnItem, treatProcessController.deleteAnItem)


export default treatProcessRouter
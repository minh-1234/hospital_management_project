import { Sequelize, Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js'
import { specialistModel } from './specialist.js';
import { customApiErrorModule } from '../error/customError.js'
const treatment_process = sequelize.define('treatment_process', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  dateBegin: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dateEnd: {
    type: DataTypes.STRING,
    allowNull: false
  },
  timeBegin: {
    type: DataTypes.STRING,
    allowNull: false
  },
  timeEnd: {
    type: DataTypes.STRING,
    allowNull: false
  },
  room: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  patientId: {
    type: DataTypes.STRING,
    references: {
      model: 'patients', // 'fathers' refers to table name
      key: 'id', // 'id' refers to column name in fathers table
    },
    allowNull: false
  },
  medicalStaffID: {
    type: DataTypes.STRING,
    references: {
      model: 'specialists',
      key: 'id',
    },
    allowNull: false
  }
}, {
  tableName: 'treatment_processes',
  timestamps: false,
  hooks: {
    beforeCreate: async (treatment_process) => {
      const [results] = await sequelize.query('SELECT UUID_SHORT() as uuid');
      treatment_process.id = results[0].uuid.toString();
    },
  }
});
treatment_process.belongsTo(specialistModel.specialist, { foreignKey: 'medicalStaffID' })
sequelize.sync({ force: false, raw: true });
const getAllTreatProcess = async (idPatient) => {
  try {
    const allProcess = await treatment_process.findAll({
      include: [
        {
          model: specialistModel.specialist,
          attributes: ['lastMiddleName', 'firstName', 'position']
        }
      ]
    }, { where: { patientId: idPatient } }
    );

    return allProcess;
  } catch (error) {
    const errorMessage = new Error(error).message
    const customError = new customApiErrorModule.CustomAPIError(422, errorMessage)
    next(customError)
  }
};
const createNew = async (Data, patientId) => {
  try {
    const validData = {
      ...Data,
      patientId: patientId
    }
    const newTreatProcess = await treatment_process.create(validData)
    return newTreatProcess.dataValues
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
const findOneById = async (id, patientId) => {
  try {

    const targetTreatProcess = await treatment_process.findByPk(id, {
      include: [{
        model: specialistModel.specialist,
        attributes: ['lastMiddleName', 'firstName', 'position']
      }]
    },
      { where: { patientId: patientId } }
    );

    return targetTreatProcess;
  } catch (error) {
    console.error("Error: ", error);
  }
}
const update = async (updateData, id, patientId) => {
  try {
    const patientUpdated = await treatment_process.update(updateData, { where: { id: id, patientId: patientId } })
    return patientUpdated
  } catch (e) {
    const errorMessage = new Error(error).message
    const customError = new customApiErrorModule.CustomAPIError(422, errorMessage)
    next(customError)
  }
}
const deleteAnItem = async (id, patientId) => {
  try {
    const deletePatient = await treatment_process.destroy({ where: { id: id, patientId: patientId } })
    return { message: "Deleted item sucessfully !" }
  } catch (e) {
    const errorMessage = new Error(error).message
    const customError = new customApiErrorModule.CustomAPIError(422, errorMessage)
    next(customError)
  }
}
const deleteManyItems = async (arrayItems, patientId) => {
  try {
    arrayItems.forEach(async (_id) => {
      await treatment_process.destroy({ where: { id: _id } })
    })
    return { message: "Deleted many items sucessfully !" }
  } catch (e) {
    const errorMessage = new Error(error).message
    const customError = new customApiErrorModule.CustomAPIError(422, errorMessage)
    next(customError)
  }
}
export const treatProcessModel = {
  treatment_process,
  getAllTreatProcess,
  update, deleteAnItem, deleteManyItems, findOneById, createNew
}

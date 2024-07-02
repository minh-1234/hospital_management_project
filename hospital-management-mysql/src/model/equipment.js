import { Sequelize, Model, DataTypes, UUID } from 'sequelize'
import { sequelize } from '../config/connection.js'
import { regularMaintenanceModel } from './regularMaintenance.js'
import { scheduleEquipmentModel } from './scheduleEquipment.js'
const equipment = sequelize.define('equipment', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'equipments',
  timestamps: false,
  hooks: {
    beforeCreate: async (equipment) => {
      const [results] = await sequelize.query('SELECT UUID_SHORT() as uuid');
      equipment.id = results[0].uuid.toString();
    },
  }
});


//associate 
equipment.hasMany(regularMaintenanceModel.regularMaintenance, { foreignKey: 'equipmentId', as: 'regularMaintenance' })
equipment.hasMany(scheduleEquipmentModel.scheduleEquipment, { foreignKey: 'equipmentId', as: 'schedule' })

sequelize.sync({ force: false }, { raw: true });


const createNew = async (Data) => {
  try {
    // Adding specialist 
    const newEquipment = await equipment.create(Data)
      .then(async (results) => {
        // Adding cert
        const [resultMaintenance] = await sequelize.query('SELECT UUID_SHORT() as uuid');
        const id = resultMaintenance[0].uuid.toString();
        const maintenanceEquipment = Data.regularMaintenance
        const validData = maintenanceEquipment.map(data => {
          return {
            ...data,
            id: id,
            equipmentId: results.id
          }
        })
        await regularMaintenanceModel.regularMaintenance.bulkCreate(validData)
        return results
      })
    return newEquipment.dataValues
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
const update = async (updateData, id) => {
  try {
    //update cert
    await regularMaintenanceModel.regularMaintenance.destroy({ where: { medicalStaffID: id } })
    const [resultMaintenance] = await sequelize.query('SELECT UUID_SHORT() as uuid')
    const idRegular = resultMaintenance[0].uuid.toString();
    const maintenanceEquipment = updateData.regularMaintenance
    const validData = maintenanceEquipment.map(data => {
      return {
        ...data,
        id: idRegular,
        equipmentId: id
      }
    })
    await regularMaintenanceModel.regularMaintenance.bulkCreate(validData)
    //update specialist
    const targetEquipment = await equipment.update(updateData, { where: { id: id } })
    return targetEquipment
  } catch (e) {
    const errorMessage = new Error(error).message
    const customError = new customApiErrorModule.CustomAPIError(422, errorMessage)
    next(customError)
  }
}
const getAllEquipments = async () => {
  try {
    const allEquipment = await equipment.findAll({
      include: [{ model: regularMaintenanceModel.regularMaintenance, as: "regularMaintenance" }]
    })
    return allEquipment
  } catch (error) {
    console.error(error)
  }
}
const findOneById = async (id) => {
  try {
    // const specialistDocs = await getDocs(collection(db, 'specialists'));
    const targetEquipment = await equipment.findByPk(id, { include: [{ model: regularMaintenanceModel.regularMaintenance, as: "regularMaintenance" }] })
    return targetEquipment
  } catch (error) {
    throw new Error(error)
  }
}
const deleteAnItem = async (id) => {
  try {
    //deleting all regular maintain
    await regularMaintenanceModel.regularMaintenance.destroy({ where: { equipmentId: id } })
    //deleting all useage schedule
    await scheduleEquipmentModel.scheduleEquipment.destroy({ where: { equipmentId: id } })
    //deleting equipment
    await equipment.destroy({ where: { id: id } })
    return { message: "Deleting an item successfully !" }
  } catch (e) {
    console.error(e)
  }
}
const deleteManyItems = async (arrayItems) => {
  try {
    arrayItems.forEach(async (_id) => {
      await deleteAnItem(_id)
    })
    return { message: "Deleting many items successfully !" }
  } catch (e) {
    console.error(e)
  }
}
export const equipmentModel = {
  createNew,
  update,
  getAllEquipments,
  findOneById,
  deleteAnItem,
  equipment,
  deleteManyItems
}
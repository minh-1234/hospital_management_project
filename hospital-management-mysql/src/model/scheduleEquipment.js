import { Sequelize, Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js'
import { customApiErrorModule } from '../error/customError.js'
const scheduleEquipment = sequelize.define('scheduleEquipment', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  dateBegin: {
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
  equipmentId: {
    type: DataTypes.STRING,
    references: {
      model: 'equipments',
      key: 'id',
    },
    allowNull: false
  }
}, {
  tableName: 'scheduleEquipments',
  timestamps: false,
  hooks: {
    beforeCreate: async (scheduleEquipment) => {
      const [results] = await sequelize.query('SELECT UUID_SHORT() as uuid');
      scheduleEquipment.id = results[0].uuid.toString();
    },
  }
});
// Đảm bảo rằng bảng "patients" đã được tạo trong cơ sở dữ liệu
sequelize.sync({ force: false, raw: true });
const createNew = async (Data, idEquipment) => {
  try {
    const validData = { ...Data, equipmentId: idEquipment }
    const newSchedule = await scheduleEquipment.create(validData)
    return newSchedule.dataValues

  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
const update = async (updateData, id, equipmentId) => {
  try {
    const targetSchedule = await scheduleEquipment.update({ updateData }, { where: { id: id, equipmentId: equipmentId } })
    return targetSchedule
  } catch (e) {
    const errorMessage = new Error(error).message
    const customError = new customApiErrorModule.CustomAPIError(422, errorMessage)
    next(customError)
  }
}
const getAllSchedule = async (equipmentId) => {
  try {
    const allEquipments = await scheduleEquipment.findAll({ where: { equipmentId: equipmentId } })
    return allEquipments
  } catch (error) {
    console.error(error)
  }
}
const findOneById = async (id, equimentId) => {
  try {
    // const specialistDocs = await getDocs(collection(db, 'specialists'));
    const targetEquipmentSchedule = await scheduleEquipment.findByPk(id, { where: { equimentId: equimentId } })
    return targetEquipmentSchedule
  } catch (error) {
    throw new Error(error)
  }
}
const deleteAnItem = async (id, equipmentId) => {
  try {
    await scheduleEquipment.destroy({ where: { id: id, equipmentId: equipmentId } })
    return { message: "Deleting an item successfully !" }
  } catch (e) {
    console.error(e)
  }
}
const deleteManyItems = async (arrayItems, equimentId) => {
  try {
    arrayItems.forEach(async (_id) => {

      await deleteAnItem(_id, equimentId)
    })

  } catch (e) {
    console.error(e)
  }
}
export const scheduleEquipmentModel = {
  createNew,
  update,
  getAllSchedule,
  findOneById,
  deleteAnItem,
  scheduleEquipment,
  deleteManyItems
}


import { _ID_RULE, _ID_RULE_MESSAGE, DATE_RULE, TIME_RULE } from '../utils/validators.js'
import { Sequelize, Model, DataTypes, UUID } from 'sequelize'
import { sequelize } from '../config/connection.js'

const schedule = sequelize.define('schedule', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  room: {
    type: DataTypes.STRING,
    allowNull: false
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
  medicalStaffID: {
    type: DataTypes.STRING,
    references: {
      model: 'specialists', // 'fathers' refers to table name
      key: 'id', // 'id' refers to column name in fathers table
    },
    allowNull: false
  }
}, {
  tableName: 'schedules',
  timestamps: false,
  hooks: {
    beforeCreate: async (schedule) => {
      const [results] = await sequelize.query('SELECT UUID_SHORT() as uuid');
      schedule.id = results[0].uuid.toString();
    },
  }
});
sequelize.sync({ force: false, raw: true });
const createNew = async (Data, specialistId) => {
  try {
    const validData = {
      ...Data,
      medicalStaffID: specialistId
    }
    const newSchedule = await schedule.create(validData)
    return newSchedule
  } catch (e) {
    throw new Error(e)
  }
}
const getAllSchedule = async (specialistId) => {
  try {
    const allSchedule = await schedule.findAll({
      where: { medicalStaffID: specialistId }
    })
    return allSchedule
  } catch (error) {
    console.error(error)
  }
}
const findOneById = async (id, specialistId) => {
  try {
    const targetSchedule = await schedule.findByPk(id, {
      where: { medicalStaffID: specialistId }
    })
    return targetSchedule
  } catch (error) {
    throw new Error(error)
  }
}
const update = async (updateData, id, specialistId) => {
  try {
    const updateSchedule = await schedule.update(updateData, { where: { id: id, medicalStaffID: specialistId } })
    return updateSchedule
  } catch (e) {
    console.error(e)
  }
}
const deleteManyItems = async (arrayItems, specialistId) => {
  try {
    arrayItems.forEach(async (_id) => {
      await deleteAnItem(_id, specialistId)
    })
    return { message: "Deleted many items sucessfully !" }
  } catch (e) {
    console.error(e)
  }
}
const deleteAnItem = async (id, specialistId) => {
  try {
    const targetSchedule = await schedule.destroy({ where: { id: id, medicalStaffID: specialistId } })
    return { message: "Deleted an item sucessfully !" }
  } catch (e) {
    console.error(e)
  }
}
export const scheduleModel = {
  schedule,
  createNew, getAllSchedule,
  update,
  deleteManyItems,
  findOneById,
  deleteAnItem
}
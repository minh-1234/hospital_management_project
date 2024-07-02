import { Sequelize, Model, DataTypes, UUID } from 'sequelize';
import { sequelize } from '../config/connection.js'


const medicine = sequelize.define('medicine', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  arrivalTime: {
    type: DataTypes.STRING,
    allowNull: false
  },
  departureTime: {
    type: DataTypes.STRING,
    allowNull: false
  },
  expireDate: {
    type: DataTypes.STRING,
    allowNull: false
  },
  arrivalDate: {
    type: DataTypes.STRING,
    allowNull: false
  },
  departureDate: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'medicines',
  timestamps: false,
  hooks: {
    beforeCreate: async (medicine) => {
      const [results] = await sequelize.query('SELECT UUID_SHORT() as uuid');
      medicine.id = results[0].uuid.toString();
    },
  }
});


sequelize.sync({ force: false }, { raw: true });

const createNew = async (Data) => {
  try {
    const newData = await medicine.create(Data)
    return newData.dataValues
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
const findOneById = async (id) => {
  try {
    const targetMedicine = await medicine.findByPk(id)
    return targetMedicine
  } catch (error) {
    throw new Error(error)
  }
}
const getAllMedicines = async () => {
  try {
    const allMedicine = await medicine.findAll()

    return allMedicine
  } catch (error) {
    console.error(error)
  }
}
const update = async (updateData, id) => {
  try {
    const targetMedicine = await medicine.update(updateData, { where: { id: id } })
    return targetMedicine
  } catch (e) {
    const errorMessage = new Error(error).message
    const customError = new customApiErrorModule.CustomAPIError(422, errorMessage)
    next(customError)
  }
}
const deleteAnItem = async (id) => {
  try {
    await medicine.destroy({ where: { id: id } })
    return { message: "Deleting item successfully !" }
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
export const medicineModel = {
  createNew,
  findOneById,
  medicine,
  getAllMedicines,
  update,
  deleteAnItem,
  deleteManyItems
}
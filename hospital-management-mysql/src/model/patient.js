import { Sequelize, Model, DataTypes, UUID } from 'sequelize';
import { sequelize } from '../config/connection.js'
import { treatProcessModel } from './treatment_process.js'
const patient = sequelize.define('patient', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  lastMiddleName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phoneNum: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dateOfBirth: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false
  },
  job: {
    type: DataTypes.STRING,
    allowNull: false
  },
  citizenID: {
    type: DataTypes.STRING,
    allowNull: false
  },
  height: {
    type: DataTypes.STRING,
    allowNull: false
  },
  weight: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bloodType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  hometown: {
    type: DataTypes.STRING,
    allowNull: false
  },
  diagnosis: {
    type: DataTypes.STRING,
    allowNull: false
  },
  symptoms: {
    type: DataTypes.STRING,
    allowNull: false
  },
  medHistory: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'patients',
  timestamps: false,
  hooks: {
    beforeCreate: async (patient) => {
      const [results] = await sequelize.query('SELECT UUID_SHORT() as uuid');
      patient.id = results[0].uuid.toString();
    },
  }
});


//associate với bảng treatment_processes
patient.hasMany(treatProcessModel.treatment_process, { foreignKey: 'patientId' })
// Đảm bảo rằng bảng "patients" đã được tạo trong cơ sở dữ liệu
sequelize.sync({ force: false }, { raw: true });
//Patient.hasMany(treatProcessModel.treatment_process)
const getAllPatients = async () => {
  try {

    const allPatients = await patient.findAll();

    return allPatients;
  } catch (error) {

    console.error('Error fetching patients:', error);
    throw error; // Ném lỗi để xử lý ở phía người gọi hàm
  }
};
const findOneById = async (id) => {
  try {

    // const allPatients = await patient.findByPk(id, {
    //   include: [{
    //     model: treatProcessModel.treatment_process,
    //     include: [{
    //       model: specialistModel.specialist,
    //       attributes: ['lastMiddleName', 'firstName', 'position']
    //     }]
    //   }]
    // });
    const targetpatient = await patient.findByPk(id)
    return targetpatient;
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
}
const createNew = async (Data) => {
  try {
    const newPatient = await patient.create(Data);
    return newPatient.dataValues
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
const update = async (updateData, id) => {
  try {
    const patientUpdated = await patient.update(updateData, { where: { id: id } })
    return patientUpdated
  } catch (e) {
    console.error(e)
  }
}
const deleteAnItem = async (id) => {
  try {
    const patientProcess = await treatProcessModel.getAllTreatProcess()
    if (patientProcess) {
      await treatProcessModel.treatment_process.destroy({ where: { patientId: id } })
    }
    const patientDeleted = await patient.destroy({ where: { id: id } })
    return patientDeleted
  } catch (e) {
    console.error(e)
  }
}
const deleteManyItems = async (arrayItems) => {
  try {
    arrayItems.forEach(async (_id) => {
      await deleteAnItem(_id)
    })
  } catch (e) {
    console.error(e)
  }
}
export const patientModel = {
  getAllPatients,
  findOneById,
  createNew,
  update, deleteAnItem, deleteManyItems,
  patient
}
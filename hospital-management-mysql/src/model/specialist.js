import { Sequelize, Model, DataTypes, UUID } from 'sequelize';
import { sequelize } from '../config/connection.js'
import { treatProcessModel } from './treatment_process.js'
import { educationModel } from './educationSpecialist.js'
import { certModel } from './certSpecialist.js'
import { scheduleModel } from './schedule.js'
const specialist = sequelize.define('specialist', {
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
  citizenID: {
    type: DataTypes.STRING,
    allowNull: false
  },
  specialty: {
    type: DataTypes.STRING,
    allowNull: false
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'specialists',
  timestamps: false, // Bỏ qua các cột `createdAt` và `updatedAt` nếu không cần thiết
  hooks: {
    beforeCreate: async (specialist) => {
      const [results] = await sequelize.query('SELECT UUID_SHORT() as uuid');
      specialist.id = results[0].uuid.toString();
    },
  }
});


//associate 
specialist.hasMany(educationModel.education, { foreignKey: 'medicalStaffID', as: 'education' })
specialist.hasMany(certModel.cert, { foreignKey: 'medicalStaffID', as: 'cert' })
specialist.hasMany(scheduleModel.schedule, { foreignKey: 'medicalStaffID', as: 'schedule' })
// Đảm bảo rằng bảng "patients" đã được tạo trong cơ sở dữ liệu
sequelize.sync({ force: false }, { raw: true });


const createNew = async (Data) => {
  try {
    // Adding specialist 
    const newSpecialist = await specialist.create(Data)
      .then(async (results) => {
        // Adding cert
        const [resultCert] = await sequelize.query('SELECT UUID_SHORT() as uuid');
        const id_cert = resultCert[0].uuid.toString();
        const certSpecialist = Data.cert
        const validDataCert = certSpecialist.map(data => {
          return {
            ...data,
            id: id_cert,
            medicalStaffID: results.id
          }
        })
        await certModel.cert.bulkCreate(validDataCert)

        // Addding education
        const [resultEducation] = await sequelize.query('SELECT UUID_SHORT() as uuid');
        const id_education = resultEducation[0].uuid.toString();
        const educationSpecialist = Data.education
        const validDataEducation = educationSpecialist.map(data => {
          return {
            ...data,
            id: id_education,
            medicalStaffID: results.id
          }
        })
        await educationModel.education.bulkCreate(validDataEducation)
        return results
      })
    return newSpecialist.dataValues
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
const update = async (updateData, id) => {
  try {
    //update cert
    await certModel.cert.destroy({ where: { medicalStaffID: id } })
    const [resultCert] = await sequelize.query('SELECT UUID_SHORT() as uuid')
    const id_cert = resultCert[0].uuid.toString();
    const certSpecialist = updateData.cert
    const validDataCert = certSpecialist.map(data => {
      return {
        ...data,
        id: id_cert,
        medicalStaffID: id
      }
    })
    await certModel.cert.bulkCreate(validDataCert)
    //update education
    await educationModel.education.destroy({ where: { medicalStaffID: id } })
    const [resultEducation] = await sequelize.query('SELECT UUID_SHORT() as uuid')
    const id_education = resultEducation[0].uuid.toString();
    const educationSpecialist = updateData.education
    const validDataEducation = educationSpecialist.map(data => {
      return {
        ...data,
        id: id_education,
        medicalStaffID: id
      }
    })
    await educationModel.education.bulkCreate(validDataEducation)
    //update specialist
    const targetSpecialist = await specialist.update(updateData, { where: { id: id } })
    return targetSpecialist
  } catch (e) {
    const errorMessage = new Error(error).message
    const customError = new customApiErrorModule.CustomAPIError(422, errorMessage)
    next(customError)
  }
}
const getAllSpecialists = async (position, specialty) => {
  try {
    // const queryDocs = query(scheduleDocs, orderBy("day", "asc"))s
    let specialistsList;
    if (position && specialty) {
      specialistsList = await specialist.findAll(
        {
          where: {
            position: position,
            specialty: specialty
          }
        },
        {
          include: [{ model: certModel.cert, as: "cert" }, { model: educationModel.education, as: "education" }]
        })
    }
    else if (position) {
      specialistsList = await specialist.findAll({
        where: {
          position: position
        }
      },
        {
          include: [{ model: certModel.cert, as: "cert" }, { model: educationModel.education, as: "education" }]
        })
    }
    else if (specialty) {
      specialistsList = await specialist.findAll({
        where: {
          specialty: specialty
        }
      }, {
        include: [{ model: certModel.cert, as: "cert" }, { model: educationModel.education, as: "education" }]
      })
    }
    else {
      specialistsList = await specialist.findAll(
        {
          include: [{ model: certModel.cert, as: "cert" }, { model: educationModel.education, as: "education" }]
        })
    }

    return specialistsList
  } catch (error) {
    console.error(error)
  }
}
const findOneById = async (id) => {
  try {
    // const specialistDocs = await getDocs(collection(db, 'specialists'));
    const targetSpecialist = await specialist.findByPk(id,
      {
        include: [{ model: certModel.cert, as: "cert" }, { model: educationModel.education, as: "education" }]
      })
    return targetSpecialist
  } catch (error) {
    throw new Error(error)
  }
}
const deleteAnItem = async (id) => {
  try {
    //Deleting cert
    await certModel.cert.destroy({ where: { medicalStaffID: id } })
    //Deleting education
    await educationModel.education.destroy({ where: { medicalStaffID: id } })
    //deleting
    await specialist.destroy({ where: { id: id } })
    return { message: "Deleting item sucessfully !" }
  } catch (e) {
    console.error(e)
  }
}
const deleteManyItems = async (arrayItems) => {
  try {
    arrayItems.forEach(async (_id) => {

      await deleteAnItem(_id)
    })
    // const docRef = await updateDoc(scheduleDoc, updateData);
    return { message: "Deleting many items sucessfully !" }
  } catch (e) {
    console.error(e)
  }
}
export const specialistModel = {
  specialist,
  createNew,
  update,
  getAllSpecialists,
  findOneById,
  deleteAnItem,
  deleteManyItems
}
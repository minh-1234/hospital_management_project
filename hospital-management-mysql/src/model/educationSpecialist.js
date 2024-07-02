import { Sequelize, Model, DataTypes, UUID } from 'sequelize';
import { sequelize } from '../config/connection.js'
import { treatProcessModel } from './treatment_process.js'
const education = sequelize.define('education', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  dateBegin: DataTypes.STRING,
  dateEnd: DataTypes.STRING,
  university: DataTypes.STRING,
  major: DataTypes.STRING,
  degree: DataTypes.STRING,
  medicalStaffID: {
    type: DataTypes.STRING,
    references: {
      model: 'specialists',
      key: 'id',
    }
  }
}, {
  tableName: 'educations',
  timestamps: false,
  hooks: {
    beforeCreate: async (education) => {
      const [results] = await sequelize.query('SELECT UUID_SHORT() as uuid');
      education.id = results[0].uuid.toString();
    },
  }
});

sequelize.sync({ force: false }, { raw: true });
export const educationModel = {

  education
}
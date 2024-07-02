import { Sequelize, Model, DataTypes, UUID } from 'sequelize';
import { sequelize } from '../config/connection.js'
const cert = sequelize.define('cert', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  title: DataTypes.STRING,
  date: DataTypes.STRING,
  organization: DataTypes.STRING,
  medicalStaffID: {
    type: DataTypes.STRING,
    references: {
      model: 'specialists',
      key: 'id',
    }
  }
}, {
  tableName: 'certs',
  timestamps: false,
  hooks: {
    beforeCreate: async (cert) => {
      const [results] = await sequelize.query('SELECT UUID_SHORT() as uuid');
      cert.id = results[0].uuid.toString();
    },
  }
});

sequelize.sync({ force: false }, { raw: true });
export const certModel = {
  cert
}
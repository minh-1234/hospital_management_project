import { Sequelize, Model, DataTypes, UUID } from 'sequelize';
import { sequelize } from '../config/connection.js'
const regularMaintenance = sequelize.define('regularMaintenance', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  dateBegin: DataTypes.STRING,
  dateEnd: DataTypes.STRING,
  description: DataTypes.TEXT,
  equipmentId: {
    type: DataTypes.STRING,
    references: {
      model: 'equipments', // 'fathers' refers to table name
      key: 'id', // 'id' refers to column name in fathers table
    }
  }
}, {
  tableName: 'regularMaintenances',
  timestamps: false, // Bỏ qua các cột `createdAt` và `updatedAt` nếu không cần thiết
  hooks: {
    beforeCreate: async (regularMaintenance) => {
      const [results] = await sequelize.query('SELECT UUID_SHORT() as uuid');
      regularMaintenance.id = results[0].uuid.toString();
    },
  }
});



sequelize.sync({ force: false }, { raw: true });

export const regularMaintenanceModel = {
  regularMaintenance
}
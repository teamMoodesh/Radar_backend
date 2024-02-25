const { DataTypes } = require('sequelize');
const {sequelize} = require('../index');
const channel_types = require('./channel_types');

const channels = sequelize.define('channels', {
  channel_id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  channel_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  channel_type_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'channel_types',
      key: 'type_id',
    },
  },
});

channels.belongsTo(channel_types, { foreignKey: 'channel_type_id' });

module.exports = channels;

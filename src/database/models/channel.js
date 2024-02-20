const { DataTypes } = require('sequelize');
const sequilize = require('../config/config');
const channel_types = require('./channel_types');

const channels = sequilize.define('channels', {
  channel_id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  channel_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  max_members: {
    type: DataTypes.INTEGER,
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

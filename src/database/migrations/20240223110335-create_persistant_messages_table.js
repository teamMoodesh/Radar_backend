'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('persistant_messages', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      message_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'messages',
          key: 'id',
        },
      },
      read_sts: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      member_id:{
        type:DataTypes.UUID,
        allowNull:false,
        references:{
            model:'members',
            key:'member_id'
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
    await queryInterface.addIndex('persistant_messages', ['message_id']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('persistant_messages');
  },
};

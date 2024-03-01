'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('channels', {
      channel_id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      channel_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      max_members: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      channel_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'channel_types',
          key: 'type_id',
        },
      },
      type:{
        type: Sequelize.STRING,
        allowNull:false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('channels');
  },
};


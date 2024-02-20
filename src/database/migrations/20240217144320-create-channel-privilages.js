'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('channel_privilages', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      role_ids: {
        type: Sequelize.JSON,
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
    await queryInterface.dropTable('channel_privilages');
  },
};

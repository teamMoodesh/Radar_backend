'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('channel_types', {
      type_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      type_name: {
        type: Sequelize.STRING,
        allowNull: false,
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
    await queryInterface.bulkInsert('channel_types', [
      { type_name: 'HIGH_SECURE', createdAt: new Date(), updatedAt: new Date() },
      { type_name: 'MEDIUM_SECURE', createdAt: new Date(), updatedAt: new Date() },
      { type_name: 'LOW_SECURE', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('channel_types');
  },
};


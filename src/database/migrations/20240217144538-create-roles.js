'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('roles', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      role_name: {
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

    await queryInterface.bulkInsert('roles', [
      { role_name: 'CEO', createdAt: new Date(), updatedAt: new Date() },
      { role_name: 'Team lead', createdAt: new Date(), updatedAt: new Date() },
      { role_name: 'Full stack developer', createdAt: new Date(), updatedAt: new Date() },
      { role_name: 'Intern', createdAt: new Date(), updatedAt: new Date() },
      { role_name: 'Project Manager', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('roles');
  },
};

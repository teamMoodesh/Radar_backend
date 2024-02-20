'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('members', {
      member_id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      member_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      member_role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id',
        },
      },
      designation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      member_user_name: {
        type: Sequelize.FLOAT, // Assuming this should be STRING
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
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('members');
  },
};

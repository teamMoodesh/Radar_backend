'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('active_clients', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      client_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'members',
          key: 'member_id',
        },
      },
      channel_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'channels',
          key: 'channel_id',
        },
      },
      ws_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      active_sts: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('active_clients');
  },
};

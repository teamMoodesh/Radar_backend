'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('messages', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      messages: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      message_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      chat_unique_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'channels',
          key: 'channel_id',
        },
      },
      sender_unique_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      receiver_unique_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      send_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      received_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      read_time: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('messages');
  },
};

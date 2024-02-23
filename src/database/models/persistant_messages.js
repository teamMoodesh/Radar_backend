const { DataTypes } = require('sequelize');
const sequilize = require('../config/config');
const messages = require('../models/messages');


const persistant_messages = sequilize.define('persistant_messages', {
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    message_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:messages,
            key:'id',
        },
    },
    read_sts:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
});

persistant_messages.belongsTo(messages, {foreignKey:'id'});

module.exports = persistant_messages;
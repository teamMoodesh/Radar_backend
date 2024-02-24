const {DataTypes} = require('sequelize');
const sequilize = require('../config/config');
const channels = require('./channel');


const messages = sequilize.define('messages', {
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    messages:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
    message_type:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    chat_unique_id:{
        type:DataTypes.UUID,
        allowNull:false,
        references:{
            model:channels,
            key:'channel_id',
        },
    },
    sender_unique_id:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    reciever_unique_id:{
        type:DataTypes.JSON,
        allowNull:false,
    },
    send_time:{
        type:DataTypes.DATE,
        allowNull:false,
    },
    received_time:{
        type:DataTypes.DATE,
        allowNull:false,
    },
    read_time:{
        type:DataTypes.DATE,
        allowNull:false,
    },
});

messages.belongsTo(channels, {foreignKey:'chat_unique_id'});

module.exports=messages;
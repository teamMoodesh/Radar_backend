const { DataTypes } = require('sequelize');
const {sequelize} = require('../index');
const messages = require('../models/messages');
const members = require('../models/members')


const persistant_messages = sequelize.define('persistant_messages', {
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    message_id:{
        type:DataTypes.UUID,
        allowNull:false,
        references:{
            model:'messages',
            key:'id',
        },
    },
    read_sts:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
    member_id:{
        type:DataTypes.UUID,
        allowNull:false,
        references:{
            model:'members',
            key:'member_id'
        }
    }
});

persistant_messages.belongsTo(messages, {foreignKey:'message_id'});
persistant_messages.belongsTo(members, {foreignKey:'member_id'});

module.exports = persistant_messages;
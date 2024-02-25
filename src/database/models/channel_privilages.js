const {DataTypes} = require('sequelize');
const {sequelize} = require('../index');
const channel_types = require('./channel_types');

const channel_privilages = sequelize.define('channel_privilages', {
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    role_ids:{
        type:DataTypes.JSON,
        allowNull:false,
    },
    channel_type_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:'channel_types',
            key:'type_id',
        },
    },
});

channel_privilages.belongsTo(channel_types, {foreignKey:'channel_type_id'});

module.exports=channel_privilages;
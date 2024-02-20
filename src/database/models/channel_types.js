const {DataTypes} = require('sequelize');
const sequilize = require('../config/config');


const channel_types = sequilize.define('channel_types', {
    type_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    type_name:{
        type:DataTypes.STRING,
        allowNull:false,
    }
})


module.exports=channel_types;
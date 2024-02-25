const {DataTypes} = require('sequelize');
const {sequelize} = require('../index');


const channel_types = sequelize.define('channel_types', {
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
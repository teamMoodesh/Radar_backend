const {DataTypes} = require('sequelize');
const sequilize = require('../config/config');

const privilage = sequilize.define('privilage', {
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    privilage_name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
});

module.exports=privilage;
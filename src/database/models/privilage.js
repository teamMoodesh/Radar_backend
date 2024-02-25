const {DataTypes} = require('sequelize');
const {sequelize} = require('../index');

const privilage = sequelize.define('privilage', {
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
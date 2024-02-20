 const {DataTypes} = require('sequelize');
 const sequilize = require('../config/config');


const roles = sequelize.define('roles', {   

    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    role_name:{
        type:DataTypes.STRING,
        allowNull:false,
    }
});

module.exports=roles;
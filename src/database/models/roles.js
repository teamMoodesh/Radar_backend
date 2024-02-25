 const {DataTypes} = require('sequelize');
 const {sequelize} = require('../index');


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
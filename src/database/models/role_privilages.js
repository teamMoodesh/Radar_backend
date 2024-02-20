const {DataTypes} = require('sequelize');
const sequilize = require('../config/config');
const roles = require('./roles');

const role_privilages = sequilize.define('role_privilages',{

    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    role_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:'roles',
            key:'id',
        },
    },
    privilage_id:{
        type:DataTypes.JSON,
        allowNull:false,
    },

});
role_privilages.belongsTo(roles,{foreignKey:'role_id'});
module.exports=role_privilages;
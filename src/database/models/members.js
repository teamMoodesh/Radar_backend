const { DataTypes } = require('sequelize');
const {sequelize} = require('../index');
const roles = require('./roles')

const members = sequelize.define('members', {
    member_id:{
        type:DataTypes.UUID,
        primaryKey:true,
    },
    member_name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    member_role_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:'roles',
            key:'role_id',
        },
    },
    designation:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    member_user_name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
});

members.belongsTo(roles, {foreignKey:'member_role_id'});

module.exports = members;
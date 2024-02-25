const { DataTypes } = require('sequelize');
const {sequelize} = require('../index');
const channels = require('./channel');
const members = require('./members');



const active_clients = sequelize.define('active_clients', {
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    client_id:{
        type:DataTypes.UUID,
        allowNull:false,
        references:{
            model:'members',
            key:'member_id',
        }
    },
    channel_id:{
        type:DataTypes.UUID,
        allowNull:true,
        references:{
            model:'channels',
            key:'channel_id',
        }
    },
    active_sts:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:false,
    }
})


active_clients.belongsTo(members, {foreignKey:'client_id'});
active_clients.belongsTo(channels, {foreignKey:'channel_id'});


module.exports=active_clients;
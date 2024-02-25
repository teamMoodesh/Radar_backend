const {DataTypes} = require('sequelize');
const {sequelize} = require('../index');
const members = require('./members');
const channels = require('./channel');

const member_channel_relation = sequelize.define('member_channel_relation', {
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    member_id:{
        type:DataTypes.UUID,
        allowNull:false,
        references:{
            model:'members',
            key:'member_id',
        },
    },
    channel_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:'channels',
            key:'channel_id',
        }
    }
});

member_channel_relation.belongsTo(members, {foreignKey:'member_id'});
member_channel_relation.belongsTo(channels, {foreignKey:'channel_id'});

module.exports = member_channel_relation;
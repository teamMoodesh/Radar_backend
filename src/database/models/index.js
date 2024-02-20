const sequelize = require('./sequelize');
const Channel = require('./models/Channel');
const ChannelTypes = require('./models/ChannelTypes');

Channel.belongsTo(ChannelTypes, { foreignKey: 'channel_type_id' });


sequelize.sync()
  .then(() => {
    console.log('Database synchronized');
    // Start your application here
  })
  .catch((error) => {
    console.error('Error synchronizing database:', error);
  });

const dotenv = require('dotenv');
const {connectDB} = require('./database/index.js');
const { app } = require('./app.js');

const http = require('http').createServer();
const WebSocket = require('ws').Server;
const {ApiError}=require('./utils/ApiError')

let wss = new WebSocket({

    server: http
});

const Routes = require('./routes/personalRoutes');
const messages = require('./database/models/messages');
const groupChatService = require('./services/groupChatService');
const { asyncHandler } = require('./utils/AsyncHandler');

http.on('request', app);
const clients={};
wss.on('connection', (ws)=>{
  
  ws.on('message', (messages)=>{
    try{
      let data = JSON.parse(messages);
      if(data.action === 'init'){
        const client_id = data.client_id;
        clients[client_id] = { ws };
        asyncHandler(groupChatService.UpdateWSActiveClients(client_id, true));
      }
    }catch (error) {
      console.log(error);  
    }
  })

  ws.on('message', async(messages)=>{
    try{
      let data = JSON.parse(messages);
      if(data.action === 'channel'){
        const channel_id = data.channel_id;
        const member_id = data.member_id;
        asyncHandler(groupChatService.updateChannelIdOfAC(channel_id, member_id));
        const pers_ids = await groupChatService.checkPersistantMessage(channel_id, member_id);
        if(pers_ids.data.length !==0){
            asyncHandler(groupChatService.updatePersistantMessage(pers_ids.data))
        }
      }
    }catch(error){
      console.log(error)
    }
  })

  ws.on('message', async(messages)=>{
    try{
      let data = JSON.parse(messages);
      if(data.action === 'message'){
        let active_member_id = [];
        const channel_id = data.channel_id;
        const client_id = data.member_id;
        const msg = data.msg;
        const datas = await groupChatService.selectActiveClients(channel_id, client_id);
        active_member_id.push(datas.data
            .map(row => row.client_id)
            .filter(client_id => client_id !== client_id));
        let wsIds = [];
        active_member_id.forEach(member => {
            wsIds.push(clients[member])
        });
        const channel_type = await groupChatService.getTypeofChannel(channel_id);
        console.log(channel_type);
        const message_id = groupChatService.saveMessage(msg, channel_id, client_id, channel_type.data.type, active_member_id);
        const inactiveClients = await groupChatService.getInactiveClients(channel_id);
        console.log(inactiveClients)
        if(inactiveClients.member_ids.length){
          const pers_ids = groupChatService.addPersistantMessage(message_id, inactiveClients.member_ids);
        }
        wsIds.forEach(wsId => {
          try {
            wsId.send(JSON.stringify({ action: 'rply', msg: msg }));
          } catch (error) {
            console.error('Error sending message:', error);
          }
        });
      }
    }catch(error){
      console.log(error);
    }
  })
})



dotenv.config({
  path: "/env",
});

connectDB()
    .then(() => {
        http.listen(process.env.PORT || 8000, () => {
            console.log(`Server/ws is running at Port:${process.env.PORT}`);
        });
    })
    .catch((e) => {
        console.log("Database connection failed", e);
    });
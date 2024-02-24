const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const WebSocket = require('ws');
const {ApiError}=require('./utils/ApiError')

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

const Routes = require('./routes/personalRoutes');
const messages = require('./database/models/messages');
const groupChatService = require('./services/groupChatService');
const { asyncHandler } = require('./utils/AsyncHandler');

app.get("/", (req, res) => {
  res.send("hello World");
});

app.use("/api/v1", Routes)

wss.on('connection', (ws)=>{
  const clients={};
  ws.on('message', (messages)=>{
    try{
      let data = JSON.parse(messages);
      if(data.action === 'init'){
        const client_id = data.client_id;
        asyncHandler(groupChatService.addActiveClients(client_id, ws));
      }
    }catch (error) {
      console.log(error);  
    }
  })

  ws.on('message', (messages)=>{
    try{
      let data = JSON.parse(messages);
      if(data.action === 'channel'){
        const channel_id = data.channel_id;
        asyncHandler(groupChatService.updateChannelIdOfAC(channel_id, ws));
      }
    }catch(error){
      console.log(error)
    }
  })

  ws.on('message', (messages)=>{
    try{
      let data = JSON.parse(messages);
      if(data.action === 'message'){
        const channel_id = data.channel_id;
        const client_id = data.member_id;
        const msg = data.msg;
        const wsIds = groupChatService.selectActiveClients(channel_id, client_id);
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
module.exports = { app };

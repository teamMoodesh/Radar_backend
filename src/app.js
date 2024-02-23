const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const WebSocket = require('ws');
const {ApiError}=require('./utils/ApiError')

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const groupChat = require('./controller/groupChatController')

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
const clients={};

app.get("/", (req, res) => {
  res.send("hello World");
});

app.use("/api/v1", Routes)

wss.on('connection', (ws)=>{
  ws.on('message', (messages)=>{
    try{
      let data = JSON.parse(messages);
      if(data.action === 'init'){
        const client_id = data.client_id;
        clients[client_id]={'ws': ws};
      }
      if(data.action === 'channel'){
        let data = JSON.parse(messages);
        Object.keys(clients).forEach((client_id)=>{
          if(client_id === data.client_id){
            clients[client_id]={'channel_id': data.channel_id};
            groupChat.groupChat(clients);
          }else{
            clients[client_id]={'channel_id':data.channel_id, 'ws':ws}
            groupChat.groupChat(clients);
          }
        })
      }
    }catch (error) {
      console.log(error);  
    }
  })
})
module.exports = { app };

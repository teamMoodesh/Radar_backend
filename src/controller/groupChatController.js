const { connect } = require('../database/mysql');
const {ApiError} = require('../utils/ApiError');

class groupChatController{


    static async groupChat(clients){

        ws.on('message', (chats)=>{
            try{
                full_clients = [];
                curr_channel = clients[client_id].channel_id
                const sql = `SELECT m.member_id, m.member_name FROM member_channel_relation mcr INNER JOIN members m ON mcr.member_id = m.member_id WHERE channel_id = ${curr_channel}`;
                const result = connect.query(sql)
                const data = JSON.parse(chats);
                if(data.action === 'chat_messages'){
                    const member_id = data.member_id;
                    const channel_id = data.channel_id;
                    const message = data.message;

                    Object.keys(clients).forEach((client_id)=>{

                        result.map((val, index)=>{
                            const member_id = val.member_id;
                            if (!full_clients.includes(member_id)) {
                                full_clients.push(member_id);
                            }            
                        })
                        
                    })
                }
            }catch(error){
                console.log(error);
                
            }
        }) 
        
        
    } 
}

module.exports=groupChatController;
const { connect } = require('../database/mysql');
const {ApiError} = require('../utils/ApiError');

class groupChatService{

    /* Update active clients to active status table */
    static async UpdateWSActiveClients(client_id, active_sts){
        console.log('addActiveClients');
        const sql = `UPDATE active_clients SET updatedAt = now(), active_sts = ${active_sts} WHERE client_id = '${client_id}'`;
        console.log(sql);
        return new Promise((resolve, reject)=>{
            connect.query(sql, (err, result)=>{
                if(err){
                    console.log('Internal Server Error')
                    return reject(new ApiError(500, 'Internal Server Error'));
                }
                const data = result[0];
                resolve({status: 'success', data});
            })
        })
} 

    /* update active clients channel */
    static async updateChannelIdOfAC(channel_id, client_id){
        console.log('addActiveClients');
        if(channel_id && client_id){
            const sql = `UPDATE active_clients SET channel_id = '${channel_id}', updatedAt = now() WHERE client_id = '${client_id}'`;
            console.log(sql)
            return new Promise((resolve, reject)=>{
                try{
                    connect.query(sql, (err, result)=>{
                        if(err){
                            console.log('Internal Server Error')
                            return reject(new ApiError(500, err.message));
                        }
                        const data = result[0];
                        resolve({status: 'success', data});
                    })
                }catch(error){
                    reject(error)
                }
            })
        }else{
            return({statusCode:"404", message:"incorrect prop value"})
        }
    }
    
    /* update active clients to inactive */
    static async updateToInactive(channel_id, client_id){
        console.log('updateToInactive');
        const sql = `UPDATE active_clients SET active_sts = 0, updatedAt = now() WHERE client_id = '${client_id}' AND channel_id = '${channel_id}'`;
        return new Promise((resolve, reject)=>{
                try{
                    connect.query(sql, (err, result)=>{
                        if(err){
                            console.log('Internal Server Error')
                            throw(new ApiError(500, 'Internal Server Error'));
                        }
                        const data = result[0];
                        resolve({status: 'success', data});
                    })
                }catch(error){
                    reject(error)
                }
            })
    }

    /* select active clients */
    static async selectActiveClients(channel_id, client_id){
        console.log('selectActiveClients');
        const sql = `
        SELECT client_id 
        FROM active_clients 
        WHERE channel_id = '${channel_id}' AND active_sts = 1
        `;
        return new Promise((resolve, reject)=>{
            connect.query(sql, (err, result)=>{
                if(err){
                    console.log('Internal Server Error')
                    reject(new ApiError(500, 'Internal Server Error'));
                    return
                }
                if (result.length === 0) {
                    reject(new ApiError(404, 'No active clients'));
                    return;
                }
                // const wsIds = result.map(row => row.ws_id);
                const data = result
                resolve({ status: 'success', data });
            })
        })
    }
    /* get channel Type */
    static async getTypeofChannel(channel_id){
        console.log('getChannelType')
        const sql = `SELECT type FROM channels WHERE channel_id = '${channel_id}'`;
        return new Promise((resolve, reject)=>{
            try{
                connect.query(sql, (err, result)=>{
                    if(err){
                        throw(new ApiError(500, 'Internal Server Error'));
                    }

                    if(result.length === 0){
                        resolve(new ApiError(403, 'No channel Found'));
                    }

                    const data = result[0];
                    resolve({status:'success', data});
                })
            }catch(error){
                reject(error);
            }
        })
    }

    /* Save message */
    static async saveMessage(msg, channel_id, client_id, channel_type, receivers){
        console.log('saveMessage');
        const sql = `
        INSERT INTO messages (messages, message_type, chat_unique_id, sender_unique_id, receiver_unique_id, send_time, createdAt, updatedAt) 
        VALUES('${msg}', '${channel_type}', '${channel_id}', '${client_id}', '${receivers}', now(), now(), now())
        `;
        return new Promise((resolve, reject)=>{
            try{
                connect.query(sql, (err, result)=>{
                    if(err){
                        console.log('Internal Server Error')
                        throw(new ApiError(500, 'Internal Server Error'));
                        return
                    }
                    const data = result.insertId
                    resolve({ status: 'success', data });
                })
            }catch(error){
                reject(error);
            }
        })
    }

    /* Get inactive Clients */
    static async getInactiveClients(channel_id){
        console.log('getInactiveClients');
        const sql = `
        SELECT mcr.member_id 
        FROM member_channel_relation mcr 
        INNER JOIN members m ON m.member_id = mcr.member_id
        INNER JOIN active_clients ac ON m.member_id = ac.client_id  
        WHERE ac.active_sts = '0' AND mcr.channel_id = '${channel_id}'
        `;
        return new Promise((resolve, reject)=>{
            try{
                connect.query(sql, (err, result)=>{
                    if(err){
                        reject(new ApiError(500, 'Internal Server Error'));
                        return
                    };

                    if(result.length === 0){
                        resolve({})
                    }

                    const member_ids = result.map(row=>row.member_id);
                    resolve({status:'success', member_ids})
                })
            }catch(error){
                reject(error);
            }
        })

    }

    static async addPersistantMessage(msg_id, member_ids){
        console.log('addPersistantMessage');
        const pers_ids = [];
        for (const member_id of member_ids) {
            const sql = `
            INSERT INTO persistant_messages (message_id, member_id, read_sts, createdAt, updatedAt) 
            VALUES(?, ?, 0, now(), now());
            `;
            try{
                const pers_id = new Promise((resolve, reject)=>{
                    connect.query(sql, [msg_id, member_id], (err,result)=>{
                        if(err){
                            reject(new ApiError(500, 'Internal Server Error'));
                            return
                        }
                        const data = result.insertId;
                        resolve(data);
                    });
                });
                pers_ids.push(pers_id);
            }
            catch(error){
                reject(error);
            }
        }
        return Promise.all(pers_ids);
    }
    
    static async checkPersistantMessage(channel_id, member_id) {
        console.log('checkPersistantMessage');
        const sql = `
        SELECT pm.id as pm_id 
        FROM persistant_messages pm 
        INNER JOIN messages m ON m.id = pm.message_id 
        WHERE m.chat_unique_id = '${channel_id}' AND pm.member_id = '${member_id}';
        `;
    
        return new Promise((resolve, reject) => {
            try{
                connect.query(sql, (err, result) => {
                    if (err) {
                        throw(new ApiError(500, 'Internal Server Error'));
                    }
        
                    if (result.length !== 0) {
                        const pers_ids = result.map(row => row.pm_id);
                        console.log(pers_ids);
                        resolve({ status: 'success', data: pers_ids });
                    } else {
                        const pers_ids = [];
                        resolve({ status: 'success', data: pers_ids });
                    }
        
                });
            }catch(error){
                reject(error)
            }
        });
    }
    

    static async updatePersistantMessage(pers_ids){
        console.log('updatePersistantMessage');
        const sql = `
        UPDATE persistant_messages SET read_sts = 1 WHERE id IN (${pers_ids.join(',')})
        `;

        try{
            return new Promise((resolve, reject)=>{
                connect.query(sql, (err, result)=>{
                    if(err){
                        reject(new ApiError(500, 'Internal Server Error'));
                    }
                    
                    resolve('success');
                })
            })
        }catch(error){
            reject(error)
        }
    }

}

module.exports=groupChatService;
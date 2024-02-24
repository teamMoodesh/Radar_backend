const { connect } = require('../database/mysql');
const {ApiError} = require('../utils/ApiError');

class groupChatService{

    /* Adding active clients to active status table */
    static async addActiveClients(client_id, ws){
        console.log('addActiveClients');
        const sql = `INSERT INTO active_clients(client_id, ws_id, active_sts, createdAt, updatedAt) VALUES('${client_id}', '${ws}', 'ACTIVE', now(), now())`;
        return new Promise((resolve, reject)=>{
            connect.query(sql, (err, result)=>{
                if(err){
                    console.log('Internal Server Error')
                    reject(new ApiError(500, 'Internal Server Error'));
                    return
                }
                const data = result[0];
                resolve({status: 'success', data});
            })
        })
    } 

    /* update active clients channel */
    static async updateChannelIdOfAC(channel_id, ws){
        console.log('addActiveClients');
        const sql = `UPDATE active_clients SET channel_id = ${channel_id} WHERE ws_id = ${ws}`;
        return new Promise((resolve, reject)=>{
            connect.query(sql, (err, result)=>{
                if(err){
                    console.log('Internal Server Error')
                    reject(new ApiError(500, 'Internal Server Error'));
                    return
                }
                const data = result[0];
                resolve({status: 'success', data});
            })
        })
    }
    
    /* select active clients */
    static async selectActiveClients(channel_id, client_id){
        console.log('addActiveClients');
        const sql = `SELECT ws_id FROM active_clients WHERE channel_id = ${channel_id} AND active_sts = 'ACTIVE`;
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
                const wsIds = result.map(row => row.ws_id);
                resolve({ status: 'success', data: wsIds });
            })
        })
    }

}

module.exports=groupChatService;
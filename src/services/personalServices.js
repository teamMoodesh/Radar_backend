const { connect } = require('../database/mysql');
const {ApiError} = require('../utils/ApiError');

class personalService {

    /* get all profile details */
    static async getAllProfileDetails(profile_id) {
        console.log('getAllProfileDetails');
        const sql = `SELECT * FROM members WHERE member_id = '${profile_id}'`;
        return new Promise((resolve, reject)=>{
            connect.query(sql,(err, result)=>{
                if(err){
                    console.log('Internal Server Error')
                    reject(new ApiError(500, 'Internal Server Error'));
                    return
                }
                if (result.length === 0) {
                    reject(new ApiError(404, 'Member not found'));
                    return;
                }
                const data = result[0];
                resolve({status: 'success', data});
            })
        })
    }

    /* get all channels of a member */
    static async getAllChannelsWithId(profile_id){
        console.log('getAllChannelsWithId');
        const sql = `SELECT c.channel_id, c.channel_name, c.channel_type_id, m.member_name, m.member_role_id, m.designation, m.member_user_name FROM channels c INNER JOIN member_channel_relation mcr ON c.channel_id = mcr.channel_id INNER JOIN members m ON m.member_id = mcr.member_id WHERE m.member_id = '${profile_id}'`;
        return new Promise((resolve, reject)=>{
            connect.query(sql, (err, result)=>{
                if(err){
                    reject(new ApiError(500, 'Internal Server Error'));
                }

                if(result.length === 0){
                    reject(new ApiError(404, 'No channel Found'));
                }
                const data = result;
                resolve({status:'Success', data})
            })
        })
    }

    /** Add member to a Channel */
    static async insertMemberChannelRelation(memberId, channelId) {

        const memberExist = await this.checkIfMemberAlreadyExists(memberId, channelId)
        if(memberExist == 0) {
            const sql = `
                INSERT INTO member_channel_relation (member_id, channel_id, createdAt, updatedAt)
                VALUES ('${memberId}', '${channelId}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `;
            return new Promise((resolve, reject)=>{
                connect.query(sql, (err, result)=>{
                    if(err){
                        reject(new ApiError(500, 'Internal Server Error'));
                    }
    
                    if(result.length === 0){
                        reject(new ApiError(404, 'Error Adding Member'));
                    }
                    const data = result;
                    resolve({status:'Success', data})
                })
            })
        } else {
            return Promise.reject(new ApiError(400, 'Member already exists in the channel'));
        }
    }

    /** Removing a member from a Channel */
    static async deleteMemberChannelRelation(memberId, channelId) {
        const sql = `
            DELETE FROM member_channel_relation
            WHERE member_id = '${memberId}' AND channel_id = '${channelId}'
        `;
        return new Promise((resolve, reject)=>{
            connect.query(sql, (err, result)=>{
                if(err){
                    reject(new ApiError(500, 'Internal Server Error'));
                }

                if(result.length === 0){
                    reject(new ApiError(404, 'Error Deleting Member'));
                }
                const data = result;
                resolve({status:'Success', data})
            })
        })
    }

    /** TO Check If a memeber is already in a Channel */

    static async checkIfMemberAlreadyExists(memberId, channelId) {
        const sql = `
            SELECT COUNT(*) AS count
            FROM member_channel_relation
            WHERE member_id = '${memberId}' AND channel_id = '${channelId}'
        `;
        return new Promise((resolve, reject)=>{
            connect.query(sql, (err, result)=>{
                if(err){
                    reject(new ApiError(500, 'Internal Server Error'));
                }

                if(result.length === 0){
                    reject(new ApiError(404, 'Error Deleting Member'));
                }
                const data = result[0].count;
                resolve(data)
            })
        })
    }
    
}


module.exports = personalService;

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

    /** To fetch all members */
    static async fetchAllMembersData() {
        const sql = `
            SELECT *
            FROM members
        `;
        return new Promise((resolve, reject)=>{
            connect.query(sql, (err, result)=>{
                if(err){
                    reject(new ApiError(500, 'Internal Server Error'));
                }

                if(result.length === 0){
                    reject(new ApiError(404, 'Error Fetching Members'));
                }
                const data = result;
                resolve(data)
            })
        })
    }

    /** To check a memeber Channel relation for personal chat*/
    static async checkAndCreateMemChannel(memberId, senderId, senderName, recieverName) {
        const commonChannelExists = await this.getMemberMemberChannels(memberId, senderId)
        if(commonChannelExists.length > 0) {
            const sql = `
                        SELECT DISTINCT mcr.channel_id
                        FROM member_channel_relation AS mcr
                        INNER JOIN channels AS ch ON mcr.channel_id = ch.channel_id
                        WHERE mcr.member_id IN ('${memberId}', '${senderId}')
                          AND ch.channel_type_id = '1'
                          AND mcr.channel_id IN (
                            SELECT channel_id
                            FROM member_channel_relation
                            WHERE member_id = '${memberId}'
                          )
                          AND mcr.channel_id IN (
                            SELECT channel_id
                            FROM member_channel_relation
                            WHERE member_id = '${senderId}'
                          );
            `;
            return new Promise((resolve, reject)=>{
                connect.query(sql, (err, result)=>{
                    if(err){
                        reject(new ApiError(500, 'Internal Server Error'));
                    }
    
                    if(result.length === 0){
                        reject(new ApiError(404, 'Error Fetching Members'));
                    }
                    const data = result;
                    resolve(data)
                })
            })
        } else {
            const channelName = senderName+recieverName;
            const sql =`
            INSERT INTO channels (channel_id, channel_name, max_members, channel_type_id, createdAt, updatedAt)
            VALUES (REPLACE(UUID(), '-', ''), '${channelName}', 10, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
            `;
            return new Promise((resolve, reject)=>{
                connect.query(sql, (err, result) => {
                    if (err) {
                      return reject(new ApiError(500, 'Internal Server Error'));
                    }
                
                    if (result.length === 0) {
                      return reject(new ApiError(404, 'Error Fetching Members'));
                    }
                
                    this.fetchChannelIdfromName(channelName)
                      .then(channelId => {
                        const channel_id = channelId[0].channel_id;
                        return Promise.all([
                          this.insertMemberChannelRelation(memberId, channel_id),
                          this.insertMemberChannelRelation(senderId, channel_id)
                        ]).then(() => {
                            return { channelId: channel_id };
                          });
                        })
                        .then(({ channelId }) => {
                          return this.getChannelMemeberDetails(memberId, channelId);
                        })
                      .then(data => resolve(data))
                      .catch(err => reject(err));
                  });
            })
        }
    }

    static async fetchChannelIdfromName(channelName) {
        const sql = `
        SELECT channel_id from channels WHERE channel_name =  '${channelName}'`;
        return new Promise((resolve, reject)=>{
            connect.query(sql, (err, result)=>{
                if(err){
                    reject(new ApiError(500, 'Internal Server Error'));
                }
                if(result.length === 0){
                    reject(new ApiError(404, 'Error Fetching Members'));
                }
                const data = result;
                resolve(data)
            })
        })
    }

    static async getChannelMemeberDetails(memberId, channelId) {
        const sql = `
            SELECT *
            FROM member_channel_relation
            WHERE member_id = '${memberId}' AND channel_id = '${channelId}'
        `;
        return new Promise((resolve, reject)=>{
            connect.query(sql, (err, result)=>{
                if(err){
                    reject(new ApiError(500, 'Internal Server Error'));
                }

                if(result.length === 0){
                    reject(new ApiError(404, 'Error Fetching Member-Channel Rel'));
                }
                const data = result;
                resolve(data)
            })
        })
    }

    static async getMemberMemberChannels(memberId, senderId) {
        const sql = `
        SELECT DISTINCT mcr.channel_id
        FROM member_channel_relation AS mcr
        INNER JOIN channels AS ch ON mcr.channel_id = ch.channel_id
        WHERE mcr.member_id IN ('${memberId}', '${senderId}')
          AND ch.channel_type_id = '1'
          AND mcr.channel_id IN (
            SELECT channel_id
            FROM member_channel_relation
            WHERE member_id = '${memberId}'
          )
          AND mcr.channel_id IN (
            SELECT channel_id
            FROM member_channel_relation
            WHERE member_id = '${senderId}'
          );
            `;
            return new Promise((resolve, reject)=>{
            connect.query(sql, (err, result)=>{
                const data = result;
                resolve(data)
            })
        })
    }
}


module.exports = personalService;

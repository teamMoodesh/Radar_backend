const { connect } = require('../database/mysql');
const {ApiError} = require('../utils/ApiError');

class personalService {
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
}

module.exports = personalService;

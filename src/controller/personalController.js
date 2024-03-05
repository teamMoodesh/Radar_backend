const express = require('express');
const personalController = express.Router();
const connect = require('../database/index');
const personalService = require('../services/personalServices');
const { ApiError } = require('../utils/ApiError');

personalController.post('/profile-data', async (req,res)=>{
    const data = req.body;
    try{
        const profile_id = data.member_id;
        if(!profile_id){
            throw(new ApiError(404, 'member_id is must'));
        }
        const members = await personalService.getAllProfileDetails(profile_id);
        res.send({"data":members});
    }catch(error){
        res.status(
            error.statusCode || 404,
            error.message || 'member_id needed',
        )
    }
});

personalController.post('/chats', async (req,res)=>{
    const data = req.body;
    try{
    const profile_id = data.member_id;
    if(!profile_id){
        throw(new ApiError(404, 'member_id needed'));
    }
    const result = await personalService.getAllChannelsWithId(profile_id);
    res.send(result);
    }catch(error){
        res.status(
            error.statusCode || 500,
            error.message || 'error occured at server',
        )
    }
})

personalController.post('/add-mem-channel', async (req,res)=>{
    const data = req.body;
    try{
        const memberId = data.member_id;
        const channelId = data.channel_id;
        if(!memberId || !channelId){
            throw(new ApiError(404, 'member_id not found'));
        }
        const result = await personalService.insertMemberChannelRelation(memberId, channelId);
        res.send(result);
    }catch(error){
        res.status(
            error.statusCode || 500,
            error.message || 'api failure',
        )
    }
})

personalController.post('/delete-mem-channel', async (req,res)=>{
    const data = req.body;
    try{
        const memberId = data.member_id;
        const channelId = data.channel_id;
        if(!memberId && !channelId){
            throw(ApiError(404, 'empty values'));
        }
        const result = await personalService.deleteMemberChannelRelation(memberId, channelId);
        res.send(result);
    }catch(error){
        res.status(
            error.statusCode || 404,
            error.message || 'api error',
        )
    }
})

personalController.get('/fetch-all-members', async (req,res)=>{
    const result = await personalService.fetchAllMembersData();
    res.send(result);
})

personalController.post('/check-and-create-mem-channel', async (req,res)=>{
    const data = req.body;
    try{
        const memberId = data.member_id;
        const senderId = data.sender_id;
        const senderName = data.sender_name;
        const recieverName = data.receiver_name;
        if(!memberId || !senderId || !senderName || !recieverName){
            throw(ApiError(404, 'Data not found error'));
        }
        const result = await personalService.checkAndCreateMemChannel(memberId, senderId, senderName, recieverName);
        res.send(result);
    }catch(error){
        res.status(
            error.statusCode || 500,
            error.message || 'api failure',
        )
    }
})

personalController.post('/get-all-channels', async (req, res) => {
    const member_id = req.body.member_id;
    try {
        if (!member_id) {
            throw (new ApiError(500, 'member_id is required'));
        }
        const result = await personalService.getAllChannelsFromMember(member_id);
        res.send(result);
    } catch (error) {
        res.status(error.statusCode || 500).send({
            message: error.message || 'Internal Server Error'
        });
    }
});

personalController.post('/fetch-chat-data', async (req,res)=>{
    const data = req.body.params;
    const channelId = data.channelId;
    const clientId = data.clientId;
    const result = await personalService.getAllChats(channelId,clientId);
    res.send(result);
});

module.exports = personalController;
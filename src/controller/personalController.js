const express = require('express');
const personalController = express.Router();
const connect = require('../database/index');
const personalService = require('../services/personalServices');

personalController.post('/profile-data', async (req,res)=>{
    const data = req.body;
    const profile_id = data.member_id;
    const members = await personalService.getAllProfileDetails(profile_id);
    res.send(members);
})

personalController.post('/chats', async (req,res)=>{
    const data = req.body;
    const profile_id = data.member_id;
    const result = await personalService.getAllChannelsWithId(profile_id);
    res.send(result);
})

personalController.post('/add-mem-channel', async (req,res)=>{
    const data = req.body;
    const memberId = data.member_id;
    const channelId = data.channel_id;
    const result = await personalService.insertMemberChannelRelation(memberId, channelId);
    res.send(result);
})

personalController.post('/delete-mem-channel', async (req,res)=>{
    const data = req.body;
    const memberId = data.member_id;
    const channelId = data.channel_id;
    const result = await personalService.deleteMemberChannelRelation(memberId, channelId);
    res.send(result);
})

personalController.get('/fetch-all-members', async (req,res)=>{
    const result = await personalService.fetchAllMembersData();
    res.send(result);
})

personalController.post('/check-and-create-mem-Channel', async (req,res)=>{
    const data = req.body;
    const memberId = data.member_id;
    const senderId = data.sender_id;
    const senderName = data.sender_name;
    const recieverName = data.reciever_name;
    const result = await personalService.checkAndCreateMemChannel(memberId, senderId, senderName, recieverName);
    res.send(result);
})


module.exports = personalController;
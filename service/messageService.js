const Mongoose = require("mongoose");
const moment = require('moment');
Mongoose.connect("mongodb://localhost/N3_CNM_ChatMongoDB");
const MessageModel = Mongoose.model("messages", {
    sender_id: String,
    username:String,
    avatarURL:String,
    room_id: String,
    messageContent: String,
    status: String,
    dateSend: String,
    imageURL: String,
    enomotion: String,
    file: String
});


//Thêm một message
async function addMessage(msg) {
	try {
        msg.dateSend=moment().format('h:mm A');
        var message = new MessageModel(msg);
        var result = await message.save();
		return result;
	} catch (error) {
		console.log(error);
		return null;
	}
}

//lấy message trong một room
async function getMessageOfRoom(roomId) {
	try {
        var result = await MessageModel.find().where({ "room_id": roomId }).exec();
		return result;
	} catch (error) {
		console.log(error);
		return null;
	}
}
module.exports = {
    getMessageOfRoom,addMessage
};


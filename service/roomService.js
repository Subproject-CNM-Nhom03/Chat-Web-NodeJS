const Mongoose = require("mongoose");
const moment = require('moment');
Mongoose.connect("mongodb://localhost/N3_CNM_ChatMongoDB");
const RoomchatModel = Mongoose.model("roomchats", {
	roomName: String,
	dateCreate: String,
	roomAvatarURL: String,
	listMember: Array,
	chatGroup:Boolean
});
const ObjectId = Mongoose.Types.ObjectId;
//Get member trong room chat
async function getMemberOfRooms(roomID) {
	try {
		var result = await RoomchatModel.aggregate([
            {$match:{_id:ObjectId(roomID)}},
            {$project: {_id: 1, listMember: 1}},
            {$unwind:"$listMember"},
            {$replaceRoot: {newRoot:"$listMember"}}
		]).exec();

        //db.roomchats.aggregate([{$match:{_id:ObjectId("615ab6668460e486e13a2220")}},{$project: {_id:0, listMember: 1}},{$unwind:"$listMember"},{$replaceRoot: {newRoot:"$listMember"}}]).pretty()
		return result;
	} catch (error) {
		console.log(error);
		return null;
	}
}
//get tất cả room chat return list room
async function getRooms() {
	try {
		let result = await RoomchatModel.find().exec();
		return result;
	} catch (error) {
		console.log(error);
		return null;
	}
}
//Thêm một roomchat
async function saveRoom(room) {
	try {
		var roomchat = new RoomchatModel(room);
		roomchat.dateCreate=moment().format('h:mm A DD/MM/YYYY');
		var result = await roomchat.save();
		return result;
	} catch (error) {
		console.log(error);
		return null;
	}
}
//thêm một member vào roomchat user={"userID":"123"}
async function addUserToRoom(room_id, user) {
	try {
		var result = RoomchatModel.findOneAndUpdate({ "_id": room_id }, { $addToSet: { 'listMember': user } }).exec();
		return result;
	} catch (error) {
		console.log(error);
		return null;
	}
}

//lấy roomchat theo member id
async function getRoomsOfUser(userID) {
	try {
		var result = await RoomchatModel.aggregate([{
			$project: {
				_id: 1, roomName: 1, dateCreate: 1,
				roomAvata: 1, listMember: 1,roomAvatarURL:1
			}
		}]).unwind('listMember').match({ "listMember.userID": userID }).exec();
		return result;
	} catch (error) {
		console.log(error);
		return null;
	}
}
//lấy roomchat theo room id
async function getRoom(id) {
	try {
		var result = await RoomchatModel.find().where({"_id":id}).exec();
		return result;
	} catch (error) {
		console.log(error);
		return null;
	}
}

module.exports = {
	getRooms,
	saveRoom,
	addUserToRoom,
	getRoomsOfUser,
	getRoom,
	getMemberOfRooms
};
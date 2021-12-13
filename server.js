//hệ thống
const path = require('path');
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
//config views ejs
app.use(express.json({ extended: false }));
app.set('views', "./views");
app.set('view engine', 'ejs');
//config stylesheet
app.use(express.static(path.join(__dirname, '/public')));
//socket io
const socketio = require('socket.io');
const io = socketio(server);

//Khai báo hàm từ lớp khác để sử dụng
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');
const { getRooms,saveRoom,addUserToRoom,getRoomsOfUser,getRoom,getMemberOfRooms } = require('./service/roomService');
const { getMessageOfRoom,addMessage } = require('./service/messageService');
//getRommchats();



//routes/controller
var loginRouter = require('./routes/login');
var dashboardRouter = require('./routes/dashboard');
app.use('/login', loginRouter);
app.use('/', dashboardRouter);

//socket
const botName = 'ChatCord Bot';
// Run when client connects
io.on('connection', socket => {
	//Đầu tiên sẽ chạy hàm này để join vào socket và kiểm tra auth
	socket.on('joinChat', ({userID}) => {
		//Kiểm tra auth
		socket.join(userID);
		//Trả về danh sách rooms 
		getRoomsOfUser(userID).then((listRooms)=>{
			socket.emit('rooms', listRooms);
			//socket.emit('message', formatMessage("hello world"));
		});
	});
	//trả về danh sách tin nhắn khi click vào rooms
	socket.on('joinRoom', (roomID) => {
		getMessageOfRoom(roomID).then((listMessage)=>{
			socket.emit('messages', listMessage);
		});
	});

	// Listen for chatMessage
	socket.on('chatMessage', msg => {
		//thêm
		const moment = require('moment');
		msg.dateSend=moment().format('h:mm A');
		addMessage(msg).then((rs)=>{
			//sau đó gửi
			getMemberOfRooms(msg.room_id).then((listmember)=>{
				listmember.forEach((member)=>{
					io.to(member.userID).emit('message',msg);
				});
			});
		})
		
		

		

		//io.to(user.room).emit('message', formatMessage(user.username, `${msg} ${socket.id} ${user.room} ${user}`));
	});

	// Runs when client disconnects
	socket.on('disconnect', () => {
		const user = userLeave(socket.id);

		if (user) {
			io.to(user.room).emit(
				'message',
				formatMessage(botName, `${user.username} has left the chat`)
			);

			// Send users and room info
			io.to(user.room).emit('roomUsers', {
				room: user.room,
				users: getRoomUsers(user.room)
			});
		}
	});
});






// //port server
// app.listen(3001,()=>{
//     console.log("Server start on port http://localhost:3001")
// })
//port của socket


server.listen(3000, () => {
	console.log("Server start on port http://localhost:3000")
})
const chatForm = document.getElementById('chat-form');// form send tin nhắn
const chatMessages = document.getElementById('chat-area');// vùng nhận tin nhắn
const dsRoom = document.getElementById('listRooms');//vùng hiển thị rooms


//lấy dữ liệu cá nhân để thêm gửi từ input hidden
const userID_DOM=document.getElementById('userID');
const userName_DOM=document.getElementById('userName');
const AvatarURL_DOM=document.getElementById('AvatarURL');
const roomID_DOM=document.getElementById('roomID');
// Get username and room from URL
// const { username, room } = Qs.parse(location.search, {
//   ignoreQueryPrefix: true,
// });
const userID = userID_DOM.value;
//Ẩn form chat khi chưa chọn room
let x = document.getElementById("myDIV");
x.style.display = "none";
let x2 = document.getElementById("myDIV2");
x2.style.display = "block";


const socket = io("http://localhost:3000/");
// Join chatroom
socket.emit('joinChat', {userID});


// Get rooms
socket.on('rooms', (listRooms) => {
	listRooms.forEach((room) => {
		displayRooms(room);
	});
});
// Nhận tin nhắn từ sv
socket.on('message', (message) => {

	if(message.room_id==roomID_DOM.value){
		outputMessage(message);
		// Scroll down
		chatMessages.scrollTop = chatMessages.scrollHeight;
	}
	
});
//load list messages lần đầu
socket.on('messages', (messages) => {
	messages.forEach((msg)=>{
		console.log(msg);
		outputMessage(msg);
		// Scroll down
		chatMessages.scrollTop = chatMessages.scrollHeight;
	});
});


// Message submit
chatForm.addEventListener('submit', (e) => {
	e.preventDefault();
	// Get message text
	let content=e.target.elements.msg.value.trim()
	if (!content) {
		return false;
	}
	let msg={
		messageContent:"",
		sender_id:"",
		username:"",
		avatarURL:"",
		room_id:""
	};
	msg.messageContent = content;
	msg.sender_id=userID_DOM.value;
	msg.username=userName_DOM.value;
	msg.avatarURL=AvatarURL_DOM.value;
	msg.room_id=roomID_DOM.value;
	msg.dateSend="";
	// Emit message to server
	socket.emit('chatMessage', msg);
	// Clear input
	e.target.elements.msg.value = '';
	e.target.elements.msg.focus();
});
//Gửi yc load ds tin nhắn của rooms và xóa html trong phòng chờ list tin nhắn cũ về
function getmsgRoom(room_id){
	chatMessages.innerHTML="";
	//set value input để gửi tới room đó
	roomID_DOM.value=room_id;
	//gửi yc lấy tin nhắn cũ về
	socket.emit('joinRoom', room_id);
	//hiện form chat khi chưa chọn room
	let x = document.getElementById("myDIV");
	x.style.display = "block";
	let x2 = document.getElementById("myDIV2");
	x2.style.display = "none";
}
// Output message khi có tin nhắn tới
function outputMessage(message) {

	chatMessages.innerHTML+=
	'<div class="message">'+
	`<a class="avatar avatar-sm mr-4 mr-lg-5" href="#" data-chat-sidebar-toggle="#chat-1-user-profile">`+
	`<img class="avatar-img" src='${message.avatarURL}' alt=""> </a>`+
	`<div class="message-body">`+
	` <div class="message-row">`+
	`<div class="d-flex align-items-center">`+
	` <div class="message-content bg-ligh" style="max-width:70%;background-color: rgb(214, 214, 214);">`+
	`<h6 class="mb-2">${message.username}</h6>`+
	` <div>${message.messageContent}</div>`+
	` <div class="mt-1">`+
	`<small class="opacity-65">${message.dateSend}</small>`+
	`</div></div>`+
	`<div class="dropdown">`+
	`<a class="text-muted opacity-60 ml-3" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fe-more-vertical"></i></a>`+
	`<div class="dropdown-menu">
	<a class="dropdown-item d-flex align-items-center" href="#">
		Edit <span class="ml-auto fe-edit-3"></span>
	</a>
	<a class="dropdown-item d-flex align-items-center" href="#">
		Share <span class="ml-auto fe-share-2"></span>
	</a>
	<a class="dropdown-item d-flex align-items-center" href="#">
		Delete <span class="ml-auto fe-trash-2"></span>
	</a>
	</div></div></div></div></div></div>`
	
	;






	// const div = document.createElement('div');
	// div.classList.add('message');//message message-right

	// // //avatar
	// div.innerHTML = '<a class="avatar avatar-sm mr-4 mr-lg-5" href="#" data-chat-sidebar-toggle="#chat-1-user-profile"><img class="avatar-img" src="https://f38-zpg.zdn.vn/6275550611604902967/10eb0b67fba10dff54b0.jpg" alt=""></a>'
	// //
	// // //body
	// let divbody = document.createElement('div');
	// divbody.classList.add('message-body');
	// div.appendChild(divbody);

	// let divrow = document.createElement('div');
	// divrow.classList.add('message-row');
	// divbody.appendChild(divrow);
	// divrow.innerHTML = `<div class="d-flex align-items-center"><div class="message-content bg-ligh" style="max-width:70%;background-color: rgb(214, 214, 214);"><h6 class="mb-2">${message.username}</h6><div>${message.messageContent}</div><div class="mt-1"><small class="opacity-65">${message.dateSend}</small></div></div></div></div>`


	// let divcenter = document.createElement('div');
	// divcenter.classList.add('d-flex align-items-center');
	// divrow.appendChild(divcenter);

	// let divmesage = document.createElement('div');
	// divmesage.classList.add('message-content bg-light');
	// divmesage.innerHTML+='<h6 class="mb-2">Hàoooooo</h6>'
	// divmesage.innerHTML+=`<div>${message.text}</div>`;
	// divcenter.appendChild(divdivmesagerow);

	// const p = document.createElement('p');
	// p.classList.add('meta');
	// p.innerText = message.username;
	// p.innerHTML += `<span>${message.time}</span>`;
	// div.appendChild(p);

	// const para = document.createElement('p');
	// para.classList.add('text');
	// para.innerText = message.text;
	// div.appendChild(para);

	//document.getElementById('chat-area').appendChild(div);
}

function displayRooms(room){
	dsRoom.innerHTML +=
	`<div onclick="getmsgRoom('${room._id}')"><a class="text-reset nav-link p-0 mb-6" >` +
	`<div class="card card-active-listener">` +
	`<div class="card-body" >` +
	`<div class="media">` +
	`<div class="avatar mr-5">` +
	`<img class="avatar-img" src="${room.roomAvatarURL}" alt="Simon Hensley"></div>` +
	`<div class="media-body overflow-hidden">` +
	`<div class="d-flex align-items-center mb-1">` +
	`<h6 class="text-truncate mb-0 mr-auto">${room.roomName}</h6>` +
	`<p class="small text-muted text-nowrap ml-4">10:38 am</p>` +
	`</div>` +
	`<div class="text-truncate">${room._id}</div>` +
	`</div>` +
	`</div>` +
	`</div>` +
	`<div class="badge badge-circle badge-primary badge-border-light badge-top-right">` +
	`<span>3</span>` +
	`</div>` +
	`</div>` +
	`</a></div>`;
}



//Prompt the user before leave chat room
// document.getElementById('leave-btn').addEventListener('click', () => {
//   const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
//   if (leaveRoom) {
//     window.location = '/';
//   } else {
//   }
// });

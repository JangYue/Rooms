module.exports = function(io){
	var socketList = {};
	var users = [];

	io.sockets.on('connection',function(socket){
		console.log('链接成功！');

		socket.on('join',(name,img) => {
			console.log(socket.id);
			socket.name = name;
			// socket会自动提供id
			socketList[name] = socket.id;
			let user = {name:name,img:img,id:socket.id,tip:false};
			users.push(user);

			socket.broadcast.emit('welcome',name,users);
			socket.emit('myself',name,users,socket.id);
		});
		//接收信息广播
		socket.on('message',data => {
			//广播
			socket.broadcast.emit('sendMsg',data);
		})
		//一对一消息
		socket.on('msg',data => {
			//console.log(data.tid);
			//广播
			console.log("data",data)
			console.log("tid",data.tid);
			socket.to(data.tid).emit('sMsg',data);
		})

		//用户离开
		socket.on('disconnecting',function(){
			if(socketList.hasOwnProperty(socket.name)){
				//删除
				delete socketList[socket.name];
				for(var i=0;i<users.length;i++){
					if(users[i].name == socket.name){
						users.splice(i,1);
					}
				}
				//广播有用户退出
				socket.broadcast.emit('quit',socket.name,users);
			}
		})
	})
}
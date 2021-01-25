var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

var date = new Date(2000,1,1,0,0,0,0); 
var connUsers = [];
var sockets = {};

io.on('connection', function(socket) {

	console.log('Se ha conectado un usuario');
	socket.broadcast.emit('chat message', "Se ha conectado un usuario");
	
	var user = null;
	connUsers.push(user);
	
	socket.on('disconnect', function(){
		console.log('El usuario (' + user + ') se ha desconectado');
		
		var index = connUsers.findIndex(function(str) {
		  return (str == user);
		});		
		connUsers.splice(index, 1);
				
		delete sockets[user];
		
		if (user == null) socket.broadcast.emit('chat message', "Se ha desconectado un usuario");
		else socket.broadcast.emit('chat message', "El usuario " + user + " se ha desconectado");
	});
	
	socket.on('chat message', function(msg){
		console.log('message: ' + msg);
		
		if (msg.startsWith("/usuario")) { 
			newUser = msg.substring("/usuario".length).trim();
			
			var index = connUsers.findIndex(function(str) {
				return (str == user);
			});
			connUsers.splice(index, 1, newUser);
			
			delete sockets[user]; 
			sockets[newUser] = socket;			
			user = newUser;
			
			socket.emit("chat message", "Nuevo usuario: \"" + user + "\"");
		}
		else if (msg == "/conectados") { 
			socket.emit("conectados", connUsers);
		}
		else if (msg.startsWith("/msg")) { 
			var str = msg.substring("/msg".length).trim();
			var dest = str.substring(0, str.indexOf(" "));
			var msg = str.substring(str.indexOf(" ") + 1);			
			if (dest in sockets) {
				socket.emit("chat message", "Mensaje enviado con éxito");
				sockets[dest].emit("chat message", "Mensaje privado de " + user + ": " + msg);
			} 
			else {socket.emit("chat message", "Mensaje no enviado (No existe el usuario) ");}
		} 
		else { 
			if (user == null) socket.broadcast.emit('chat message', "Invitado: " + msg); 
			else socket.broadcast.emit('chat message', user + ": " + msg); 
		}
	});
	socket.on('writing', function(msg) {date = new Date();});
	setInterval(function() { var escribiendo = ((new Date()) - date) <= 1000;io.emit('writing', escribiendo);}, 1000);
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});

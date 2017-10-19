var express = require('express');
//var http = require('http');
var path = require('path');
var app = express();
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var index = require('./routes/index');
var users = require('./routes/users');
var mysql = require('mysql');


// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/users', users);
//require('./db');


//Conexión a BD
connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'app'
});

server.listen(8080, function() {
  console.log("Servidor corriendo en http://localhost:8080");
});

/*app.get('/hello', function(req, res) {
  res.status(200).send("Hello World!");
});*/

//Ruta a login y registro
app.get('/loginRegister', function(req, res, next) {
  res.render('../public/loginRegister');
});
//Ruta a creación de salas
app.get('/crearSala', function(req, res, next) {
  res.render('../public/crearSala');
});

//POST
//Agregar sala
app.post("/addSala",function(req, res) {

	var nombre = req.body.nombre;
	var descripcion = req.body.descripcion;
	
	connection.query("INSERT INTO sala (nombre,descripcion) VALUES (\""+nombre+"\",\""+descripcion+"\")",function(e,r){
		if (e) throw e;
    	console.log("valor insertado");
	});
	res.redirect("/salasChat");
  
});

//Agregar usuario
app.post("/addUser",function(req, res) {

	var nombre = req.body.nombre;
	var apellido = req.body.apellido;
	var correo = req.body.correo;
	var password = req.body.password;
	var username = req.body.username;
	
	connection.query("INSERT INTO user (nombre,apellido,correo,password,username) VALUES (\""+nombre+"\",\""+apellido+"\",\""+correo+"\",\""+password+"\",\""+username+"\")",function(e,r){
		if (e) throw e;
    	console.log("valor insertado");
	});

	res.render("../public/loginRegister");
  
});

//GET
//Obtener usuario
app.get("/login", function(req, res){
	
	var username = req.body.username;
	var password = req.body.password;
	
	connection.query("SELECT password FROM user WHERE username =\""+username+"\"" , function(e,r){
		console.log(r);
		if (e){ 
			
			res.send("Usuario no encontrado");
		}

		res.redirect('/salasChatAdmin/:'+idN);
	});	
		
	
});

//Obtener videos por salaAdmin
app.get("/salaAdmin/:id", function(req, res){

	var id  = req.params.id;
	var idS = id.split(":")[1];
	//console.log(idS);

	connection.query("SELECT * FROM video WHERE idSala = \""+idS+"\"", function(e,r){
		if (e) throw e;
		console.log(r);
		res.render("../public/salaAdmin", {videos:r});				
	});

});

//Obtener videos por sala invitado
app.get("/sala/:id", function(req, res){

		var id  = req.params.id;
		var idS = id.split(":")[1];
		//console.log(idS);

	     connection.query("SELECT * FROM video WHERE idSala = \""+idS+"\"", function(e,r){
				if (e) throw e;
				console.log(r);
				res.render("../public/sala", {videos:r});				
		});

 });

//Obtener salas creadas por sala admin
app.get("/salasChatAdmin/:idN",function(req, res) {

	idN  = req.params;
	console.log(idN);

	connection.query("SELECT * FROM sala", function(e,r){
			if (e) throw e;
			console.log(r);
    		res.render('../public/salasChatAdmin', {salas:r});
	});
    
});

//Obtener salas creadas por sala invitado
app.get("/salasChat", function(req, res, next) {

  	connection.query("SELECT * FROM sala", function(e,r){
			if (e) throw e;
			console.log(r);
    		res.render("../public/salasChat", {salas:r});
	});

});

/*app.post("/addVideo",function(req, res) {
	console.log("agregando video");
	var url = req.body.idVideo;
	var idSala = req.body.idSala;
	console.log(idSala);
	connection.query("INSERT INTO video (url, idSala) VALUES (\""+url+"\",\""+idSala+"\")",function(e,r){
		if (e) throw e;
		console.log(e);
    	console.log("valor insertado");

	});
	
  
});
*/

/*app.get("/sala/:id",function(req, res){
		connection.query("SELECT * FROM video", function(e,r){

			if (e) throw e;
			console.log(r);
			res.render("../public/sala", {videos:r});				
		});
	});
*/

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// catch 404 and forward to error handler

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


/*SOCKETS*/

io.on('connection',function(socket){
	console.log("usuario id : %s",socket.id);

	var idSala = "0";
	//socket.broadcast.emit('message','El usuario '+socket.id+' se ha conectado!','System');
	//Permite unirse a una sala con id unico
	socket.join(idSala);

	//Asigna la sala a la que se ha entrado
	socket.on('change idSala',function(newSala){
		socket.leave(idSala);
		socket.join(newSala);
		idSala = newSala;
		socket.emit('change idSala',newSala);
	});
	
	//Envia mensajes a quienes se encuentren en la misma sala
	socket.on('message',function(msj){
		//io.emit('message',msj,socket.id);
		io.sockets.in(idSala).emit('message',msj,socket.id); //enviar a todos del canal
		//socket.broadcast.to(channel).emit('message',msj,socket.id); //enviar a todos del canal menos a mi
	});

	//Permite agregar un nuevo video desde la sala y permite obtenerlo para enviar la playlist a la sala
	socket.on('nuevoVideo',function(video){
		io.sockets.in(idSala).emit('nuevoV',video,socket.id); //enviar a todos del canal
		var idS = idSala; 

		connection.query("INSERT INTO video (url, idSala) VALUES (\""+video+"\",\""+idS+"\")",function(e,r){
			if (e) throw e;
			console.log(e);
			console.log("agregadoo");
	    });
	});

	//Permite recuperar los videos que han sido agregados en la sala
	socket.on('getVideos', function(){
		console.log("obteniendo videos");
		var idS = idSala; 
		console.log("getV "+idS);
		connection.query("SELECT * FROM video WHERE idSala = \""+idS+"\"", function(e,r){
				if (e) throw e;
				console.log(r);
				console.log("enviar lista");
				var videos = [];
				if(r.length>0){
					for(i = 0; i<r.length; i++){
						var video = r[i].url;
						videos.push(video);
					}
				}
				io.sockets.in(idSala).emit('listaVideos',{videos});
				//socket.emit('listaVideos', {videos});				
		});
	});

	//Permite emitir el video a los invitados de la sala
	socket.on('youtubeMode', function(lista){
    	console.log(2);
    	console.log(lista);
        io.sockets.in(idSala).emit('youtubeMode', lista);
        //socket.broadcast.to(idSala).emit('youtubeMode', lista);
    });	

	//Funciones video player
	socket.on('yt_stop', function(){
        io.sockets.in(idSala).emit('stop_yt');
    });

    socket.on('yt_pause', function(){
        io.sockets.in(idSala).emit('pause_yt');
    });

    socket.on('yt_play', function(lista){
        socket.broadcast.to(idSala).emit('youtubeRePlay', lista);
    });

    socket.on('disconnect',function(){
		console.log("Desconectado : %s",socket.id);
	});
	
});




module.exports = app;

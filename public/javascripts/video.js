/*
//Sala
var sala;
var socket = io.connect('http://localhost:8080', { 'forceNew': true });
//Script API Youtube
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
//Video Player Youtube
var player;
//Objeto recuperado de lista de videos BD
var playlistId = [];
//Almacen de lista de videos como array/string
var playlist;

socket.on('connected', function(data){
    console.log(data);
});
//Asignando sala y recuperando videos
function salaFunction(sala){
	socket.emit('change idSala', idSala);
	socket.emit('getVideos');
};
//Funciones de envío de mensaje a la interconexion y video a la BD
$(function(){
			$("#mensaje").submit(function(){

				var mensaje = $("#msj").val();
				if(mensaje=='') return false;
				//evento message en el server nodejs
				console.log(mensaje);
				socket.emit('message',mensaje);
				$("#msj").val('').focus();
				return false;

			});
		
			$("#videoURL").submit(function(){

				var video = $("#idVideo").val();
				if(video=='') return false;
				//evento message en el server nodejs
				console.log(video);
				socket.emit('nuevoVideo',video);
				$("#idVideo").val('').focus();
				return false;

			});
			

});

//Agrega los nuevos mensajes dentro de etiqueta li mostrada en pantalla	
socket.on('message',function(msg,id){
	$("#message").append($('<li>').text(id+' : ' +msg));
});
//Al agregar nuevo video se muestra en pantalla dentro de una etiqueta li
socket.on('nuevoV',function(video,id){
	//playlist.push(video);
	$("#video").append($('<li>').text('' +video));
});
//Al cambiar sala muestra el mensaje de bienvenida a la sala correspondiente
socket.on('change idSala',function(idSala){
	$("#message").html('').append($('<li>').text('¡Bienvenido a la sala '+idSala+' !'));					
});
//Recupera la lista de videos almacenados en la base de datos
socket.on('listaVideos', function(videos){
	playlistId.push(videos);
	console.log("traje videos");
	console.log(playlistId);
	//playlist = playlistId[1].videos;
});

//Crea el player Iframe de youtube
function onYouTubeIframeAPIReady() {
	
	player = new YT.Player('player', {
	  height: '300',
	  width: '90%',
     loadPlaylist:{
        listType:'playlist',
        list: playlist,
        index:parseInt(0),
       },
	  events: {
	    'onReady': onPlayerReady,
	    'onStateChange': onPlayerStateChange
	  }
	});
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
	console.log("playereeedi");
	event.target.loadPlaylist(playlist);
	console.log(playlist);
}

// 5. The API calls this function when the player's state changes.
var done = false;

function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.PLAYING && !done) {
	  //setTimeout(stopVideo, 6000);
	  done = true;
	}else if(event.data == YT.PlayerState.ENDED){
		console.log('getVideos');
		socket.emit('getVideos');
		loadYTVideo();
	}
}

function stopVideo() {
	player.stopVideo();
	socket.emit('yt_stop');
	document.getElementById("btnPlay").value="play";
	document.getElementById("btnPlay").innerHTML = "<i class=\"icon-play\"></i> Play";
}

function pauseVideo(){
	player.pauseVideo();
	socket.emit('yt_pause');
}

function playVideo(){
	player.getVideoLoadedFraction();
	
	var videoState = document.getElementById("btnPlay").value;
	if(videoState == "play"){
		player.playVideo();
		index = player.getPlaylistIndex();
		console.log(index);
		console.log("playvideo");
		if(index == 0){
			socket.emit('yt_play', playlist);
		}else if(index == 1){
			playlist.shift();
			socket.emit('yt_play', playlist);
		}else if(index => 2){
			for (var i = 0; i<index; i++) {
				playlist.shift();	
			}
			socket.emit('yt_play', playlist);
		}
		document.getElementById("btnPlay").value="pause";
		document.getElementById("btnPlay").innerHTML = "<i class=\"icon-pause\"></i> Pause";
	}else{
		player.pauseVideo();
		socket.emit('yt_pause');
		document.getElementById("btnPlay").value="play";
		document.getElementById("btnPlay").innerHTML = "<i class=\"icon-play\"></i> Play";
	}
}

function appearYTVideo(){
	//idVid = document.getElementById("hola").value;	
	document.getElementById("yt").style.display = 'block';
}

//Cambia los modos
//Carga el vídeo
function loadYTVideo(){
	
	var i = playlistId.length;
	console.log(i);
	playlist = playlistId[i-1].videos;
	console.log(playlist);
	onYouTubeIframeAPIReady();
	ytModeRender();
	socket.emit('youtubeMode', playlist);
	//ytVideoLoader();
	console.log("dentro de loadYTVideo");
}

function ytModeRender(){
	console.log("render");
	console.log(playlist);
	document.getElementById("yt").setAttribute("style", "display:block; margin-top:0px;");

}

function ytVideoLoader(){
	console.log("loader");
	//event.target.loadPlaylist(playlist);
	player.loadPlaylist(playlist);
	//player.cueVideoById(idVid, 0, 'large');
	
	//player.cuePlaylist(playlist);	
}

socket.on('stop_yt', function(){
	console.log("Stop Video");
	player.stopVideo();
});

socket.on('pause_yt', function(){
	console.log("Pause Video");
	player.pauseVideo();
});

socket.on('play_yt', function(){
	console.log("Play Video");
	player.playVideo();
});


socket.on('youtubeMode', function(lista){
	playlist = lista;
	console.log("YouTubemODE");
	ytModeRender();
	ytVideoLoader();
});

socket.on('youtubeRePlay', function(lista){
	playlist = lista;
	
	console.log("replay");
	console.log(playlist);
	ytModeRender();
	ytVideoLoader();
});*/
//Sala
var sala;
var socket = io.connect('http://localhost:8080', { 'forceNew': true });
//Script API Youtube
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
//Video Player Youtube
var player;
//Objeto recuperado de lista de videos BD
var playlistId = [];
//Almacen de lista de videos como array/string
var playlist;

socket.on('connected', function(data){
    console.log(data);
});
//Asignando sala y recuperando videos
function salaFunction(sala){
	socket.emit('change idSala', idSala);
	socket.emit('getVideos');
};
//Funciones de envío de mensaje a la interconexion y video a la BD
$(function(){
			$("#mensaje").submit(function(){

				var mensaje = $("#msj").val();
				if(mensaje=='') return false;
				//evento message en el server nodejs
				console.log(mensaje);
				socket.emit('message',mensaje);
				$("#msj").val('').focus();
				return false;

			});
		
			$("#videoURL").submit(function(){

				var video = $("#idVideo").val();
				if(video=='') return false;
				//evento message en el server nodejs
				console.log(video);
				socket.emit('nuevoVideo',video);
				playlist.push(video);
				$("#idVideo").val('').focus();
				return false;

			});
});

//Agrega los nuevos mensajes dentro de etiqueta li mostrada en pantalla	
socket.on('message',function(msg,id){
	$("#message").append($('<li>').text(id+' : ' +msg));
});

//Al agregar nuevo video se muestra en pantalla dentro de una etiqueta li
socket.on('nuevoV',function(video,id){
	//playlist.push(video);
	$("#video").append($('<li>').text('' +video));
});

//Al cambiar sala muestra el mensaje de bienvenida a la sala correspondiente
socket.on('change idSala',function(idSala){
	$("#message").html('').append($('<li>').text('¡Bienvenido a la sala '+idSala+' !'));					
});

//Recupera la lista de videos almacenados en la base de datos
socket.on('listaVideos', function(videos){
	playlistId.push(videos);
	console.log("traje videos");
	console.log(playlistId);
	
});

//Crea el player Iframe de youtube
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
	  height: '300',
	  width: '90%',
	  playerVars: {'controls': 0 },
     loadPlaylist:{
        listType:'playlist',
        list: playlist,
        index:parseInt(0),
       },
	  events: {
	    'onReady': onPlayerReady,
	    'onStateChange': onPlayerStateChange
	  }
	});
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
	console.log("playereeedi");
	event.target.loadPlaylist(playlist);
	console.log(playlist);
}

// 5. The API calls this function when the player's state changes.
var done = false;

function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.PLAYING && !done) {
	  //setTimeout(stopVideo, 6000);
	  done = true;
	}/*else if(event.data == YT.PlayerState.ENDED){
		//loadYTVideo();
	}*/
}

function stopVideo() {
	player.stopVideo();
	socket.emit('yt_stop');
	document.getElementById("btnPlay").value="play";
	document.getElementById("btnPlay").innerHTML = "<i class=\"icon-play\"></i> Play";
}

function pauseVideo(){
	player.pauseVideo();
	socket.emit('yt_pause');
}

function playVideo(){
	player.getVideoLoadedFraction();
	var videoState = document.getElementById("btnPlay").value;
	if(videoState == "play"){
		player.playVideo();
		index = player.getPlaylistIndex();
		console.log(index);
		console.log("playvideo");
		if(index == 0){
			socket.emit('yt_play', playlist);
		}else if(index == 1){
			playlist.shift();
			socket.emit('yt_play', playlist);
		}else if(index => 2){
			for (var i = 0; i<index; i++) {
				playlist.shift();	
			}
			socket.emit('yt_play', playlist);
		}
		document.getElementById("btnPlay").value="pause";
		document.getElementById("btnPlay").innerHTML = "<i class=\"icon-pause\"></i> Pause";
	}else{
		player.pauseVideo();
		socket.emit('yt_pause');
		document.getElementById("btnPlay").value="play";
		document.getElementById("btnPlay").innerHTML = "<i class=\"icon-play\"></i> Play";
	}
}

function appearYTVideo(){
	//idVid = document.getElementById("hola").value;	
	document.getElementById("yt").style.display = 'block';
}

//Cambia los modos
//Carga el vídeo
function loadYTVideo(){
	var i = playlistId.length;
	console.log(i);
	playlist = playlistId[i-1].videos;
	console.log(playlist);
	onYouTubeIframeAPIReady();
	ytModeRender();
	socket.emit('youtubeMode', playlist);
	//ytVideoLoader();
	console.log("dentro de loadYTVideo");
}

function ytModeRender(){
	console.log("render");
	console.log(playlist);
	document.getElementById("yt").setAttribute("style", "display:block; margin-top:0px;");
}

function ytVideoLoader(){
	console.log("loader");
	//event.target.loadPlaylist(playlist);
	player.loadPlaylist(playlist);
	//player.cueVideoById(idVid, 0, 'large');
	//player.cuePlaylist(playlist);	
}

socket.on('stop_yt', function(){
	console.log("Stop Video");
	player.stopVideo();
});

socket.on('pause_yt', function(){
	console.log("Pause Video");
	player.pauseVideo();
});

socket.on('play_yt', function(){
	console.log("Play Video");
	player.playVideo();
});


socket.on('youtubeMode', function(lista){
	playlist = lista;
	console.log("YouTubemODE");
	ytModeRender();
	ytVideoLoader();
});

socket.on('youtubeRePlay', function(lista){
	playlist = lista;
	console.log("replay");
	console.log(playlist);
	ytModeRender();
	ytVideoLoader();
});
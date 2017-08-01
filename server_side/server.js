/*
   Sync-o-Tube / SYNCROTUBO

   By Grizz - SPEARS

   2017

   Spartan Bears SpA - All Rights Reserved
*/

var hostURL = 'http://syncotube.spartanbears.cl';

//Server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
//DB
var mysql = require('mysql');
//Misc
var fs = require('fs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//API
app.get('/', function (req, res) {
   fs.readFile('index.html', function (err, data) {
      if (err) {
         console.log(err);
         // HTTP Status: 404 : NOT FOUND
         // Content Type: text/plain
         res.writeHead(404, {'Content-Type': 'text/html'});
      }else {  
         //Page found     
         // HTTP Status: 200 : OK
         // Content Type: text/plain
         res.writeHead(200, {'Content-Type': 'text/html'});  
         
         // Write the content of the file to response body
         res.write(data.toString());
      }
      // Send the response body 
      res.end();
   });
});

//createRoom
app.post('/createRoom', function (req, res) {

   createRoom();
});

//joinRoom
app.get('/room/:roomId', function (req, res) {

   console.log(req.params.roomId);
});

//addVideo
app.post('/addVideo', function (req, res) {

   var room_id = req.body.rid;
   var video_url = req.body.vurl;

   addVideo(room_id, video_url);
});

//removeVideo
app.post('/removeVideo', function (req, res) {

   var room_id = req.body.rid;
   var video_id = req.body.vid;

   removeVideo(room_id, video_id);
});



//SERVER
var server = app.listen(50000, function(){

   var host = server.address().address;
   var port = server.address().port;

   console.log("SYNC-O-TUBE running at http://%s:%s", host, port);

});

//DB
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'sparthka_dev',
  password : 'spartan123321BEARSmysql',
  database : 'sparthka_syncotube'
});

/*connection.connect()

connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
  if (err) throw err

  console.log('The solution is: ', rows[0].solution)
})

connection.end()*/

function createRoom(){

   //creates and saves room
}

function addVideo(room_id, video_url){

   //add video to db
}

function removeVideo(room_id, video_id){

}

function refreshPlaylist(room_id){

   //refresh playlist for room
}
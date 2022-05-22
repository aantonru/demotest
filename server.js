var fs = require('fs');
var https = require('https');
var express = require('express');
var app = express();

var options = {
    key: fs.readFileSync('./file.pem'),
    cert: fs.readFileSync('./file.crt')
};
var serverPort = 443;
var server = https.createServer(options, app);
/*
var io = require('socket.io')(server,  {
    cors: {
      origin: "https://192.168.1.162",
      methods: ["GET", "POST"],
      credentials: true
    }
  });
var users=[];
/*
io.on('connection', function(socket) {
  users.push(socket);
  let n=users.length;
  console.log(`${n} connection ${socket.id}`);
  let list=fs.readdirSync('public/video');
  console.log(list.join('\n'))
  socket.emit('message', list)
  socket.on('message',(msg)=>{
    console.log(`${n} : ${msg.pth}`)
    console.log(msg.e)
    let other=users.find((it,id)=>{ return (id!=(n-1))});
    if (other!==undefined && other!==null && (typeof other['emit']==='function')) other.emit('message', msg);
  })
});
*/

var mlist=[];
app.use( express.static('dist/'));
server.listen(serverPort, function() {
//  let list=fs.readdirSync('/Volumes/MacHDD/temp/video/');
//  console.log(list.map(it=>{ return (`        ${it.replace('.mp4','')}`.slice(-8))}).join(''))
//  mlist=list
  console.log('server up and running at %s port', serverPort);
});

app.post('/video', function(request, response){
  console.log(request.body);      // your JSON
  let out=JSON.stringify(mlist);
   response.send(out);    // echo the result back
});

/*setInterval(() => {
  console.log(`${users.length} online`);
}, 9000);*/
var restify = require('restify');
var builder = require('botbuilder');
var express = require('express')
var app = express()



//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
app.set('port', process.env.PORT)
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: 'dd891a7a-0888-4798-b396-dc1cd74f1314',
    appPassword: 'E2zqFoxhFUgBDt8HrV4MsmB'
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', function (session) {
	console.log("Entered bot.dialog");
    session.send("Hello World HEllooooooo");
});

app.get('/', function (req, res) {
  console.log("Entered app.get");
  res.send('Hello World!')
})
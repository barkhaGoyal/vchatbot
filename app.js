var restify = require('restify');
var builder = require('botbuilder');
var express = require('express')
var app = express()



//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
app.set('port', process.env.PORT);
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

// Creating a model
var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/210b186e-9ae4-4c25-bba9-7a005360b7d8?subscription-key=ebecd0f5a31b4f12b8876ab6ac4634c3&q=Hi&verbose=true';


var recognizer = new builder.LuisRecognizer(model);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', intents);

intents.matches('Hi', [
    function (session, args, next) {
        console.log("hi");
        //builder.Prompts.text(session, "Hello...  How can I help you today?");
        next();
    }
]);


//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', function (session) {
	console.log("Entered bot.dialog");
    session.send("Hello World HEllooooooo");
});

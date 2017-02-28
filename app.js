var restify = require('restify');
var builder = require('botbuilder');
var express = require('express');
var Prompts = require('prompt');
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
var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/210b186e-9ae4-4c25-bba9-7a005360b7d8?subscription-key=ebecd0f5a31b4f12b8876ab6ac4634c3&verbose=true';


var recognizer = new builder.LuisRecognizer(model);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', intents);

intents.matches('Good', [
    function (session, args, next) {
        console.log("Good intent");
        builder.Prompts.text(session, session.message.text + "..How can I help you?");
        next();
    }
]);


//=========================================================
// Bots Dialogs
//=========================================================

//bot.dialog('/', function (session) {
//	console.log("Entered bot.dialog");
 //   session.send("Hello World HEllooooooo");
//});

intents.matches('Greetings', [
    function (session, args, next) {
        console.log("Greetings");
        builder.Prompts.text(session, "Hello...How can I help you?");
        next();
    }
]);	

intents.matches('None', [
    function (session, args, next) {
        console.log("None");
        builder.Prompts.text(session, "Sorry I didn't get it! We offer credit card");
        next();
    }
]);	

// for credit card

intents.matches('card', [
    function (session, args, next) {
        console.log("card");
        builder.Prompts.text(session, "Sure We can help you. We offer Credit cards. Are you looking for personal or small business cards? ")
       },
    function (session, results) {
        session.cardtype=results.response;
        console.log(session.cardtype)
        var substring="personal";
	    	if (session.cardtype.indexOf(substring) !== -1){
        session.beginDialog('/personalCard');
    }
    }
]);

bot.dialog('/personalCard', [
    function (session) {
         builder.Prompts.choice(session, "Sure. May I know what benefits are you looking in your card ?  Could you indicate your choice amongst the following?", ['Cashbacks','Membership Rewards','No Annual Fees','Travel'],{ listStyle: builder.ListStyle.button });

    },
        function (session, results) {
        console.log(results.response.entity);
         console.log(results.response.index);
        switch (results.response.index) {
           
            case 0:
                builder.Prompts.text(session,"We’ve the following cards for you with delighting cashback offers ! Please choose the card you’d like to have");
                console.log("In cashback case switch");
                
                session.beginDialog('/Cashbacks');
                break;
            case 1:
                session.beginDialog('/memReward');
                break;
            case 2:
                session.beginDialog('/NoAnnualFees');
                break;
            case 3:
                session.beginDialog('/Travel');
                break;
            default:
                session.endDialog();
                break;
        }
        }
]);

function CreateHeroCard(session, builder, title, subtitle, text, url, buttons){
    var card = new builder.HeroCard(session)
        .title(title)
        .subtitle(subtitle)
        .text(text)     
        .images([builder.CardImage.create(session, url)])
        .buttons(buttons);      
    return card;
}
   
bot.dialog('/Cashbacks', [
    function (session) {
    	console.log("In cashback");
        builder.Prompts.text(session,"In cashback images");
        var buttons1 = [];   
		var attachments1 = [];
    buttons1.push(builder.CardAction.openUrl(session, "https://www.google.com", "Click here to apply"));
    var card1 = CreateHeroCard(session, builder, "1) Credit card", "Platinum Card", 
                            " ",
                            "https://djstorm.files.wordpress.com/2011/05/visa-jp-morgan.jpg",  
                            buttons1);

    attachments1.push(card1);

    var msg1 = new builder.Message(session)
    .attachments(attachments1);
    session.send(msg1);
    
    var buttons2 = [];
        buttons2.push(builder.CardAction.openUrl(session, "https://djstorm.files.wordpress.com/2011/05/visa-jp-morgan.jpg", "Click here to apply"));  

    var attachments2 = [];
    var card2 = CreateHeroCard(session, builder, "2) Credit card", "Gold Card", 
                            " ",
                            "https://djstorm.files.wordpress.com/2011/05/visa-jp-morgan.jpg",  
                            buttons2);

    attachments2.push(card2);

    var msg2 = new builder.Message(session)
    .attachments(attachments2);
    session.send(msg2);
    
    var buttons3 = [];
    
        buttons3.push(builder.CardAction.openUrl(session, "https://djstorm.files.wordpress.com/2011/05/visa-jp-morgan.jpg", "Click here to apply"));

    var attachments3 = [];
    var card3 = CreateHeroCard(session, builder, "3) Credit card", "Silver Card", 
                            " ",
                            "https://djstorm.files.wordpress.com/2011/05/visa-jp-morgan.jpg",  
                            buttons3);

    attachments3.push(card3);

    var msg3 = new builder.Message(session)
    .attachments(attachments3);
    session.send(msg3);
    session.beginDialog('/thankApply');
    }
]);
bot.dialog('/thankApply',[
    function (session,args,next) {
	  builder.Prompts.text(session, 'Thank you!!! You can now apply instantly for this card by filling the application. It takes just a few minutes.  Is there anything else I can help you with.');
     next();
    }
]);
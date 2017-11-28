const request = require('request');
const botResponse = require('./bot_response.js')
const SLACK_VERIFICATION_TOKEN = process.env.SLACK_VERIFICATION_TOKEN
const BOT_OAUTH_ACCESS_TOKEN = process.env.BOT_OAUTH_ACCESS_TOKEN

const createResponse = (statusCode, body) => {
    return {
        statusCode: statusCode,
        body: JSON.stringify(body)
    }
};

exports.slack_event = function(event, context, callback) {
  var body = JSON.parse(event["body"]);

  if(body["token"] != SLACK_VERIFICATION_TOKEN) {
      console.warn("Warning: Token does not come from Slack!");
      callback(null, createResponse(200,''));
      return;
  }

  
  // Respond to initial Slack challenge to subscribe to Events API
  if(body["challenge"]) {
      callback(null, createResponse(200,{
          challenge: body["challenge"]
      }));
      return;
  }

  // Don't respond to bots, or else this causes an infinite loop with itself.
  if(body["event"]["subtype"] === "bot_message"){
      console.warn("This message is from a bot")
      callback(null, createResponse(200,''))
      return;
  }

  var responseText = botResponse(body["event"], context)
  
  var data = {
    token: BOT_OAUTH_ACCESS_TOKEN,
    channel: body["event"]["channel"],
    as_user: false,
    response_type: 'in_channel',
    text: responseText
  };

  request.post({
    uri: "https://slack.com/api/chat.postMessage",
    form: data    
  }, (err, result) => {
      if (err) {
          return callback(null, createResponse(400, err));
      }      
      callback(null, createResponse(200, ''))
  });
}
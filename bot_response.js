module.exports = (slack_event, context) => {
    return "You said: " + slack_event["text"];
};
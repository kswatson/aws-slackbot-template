# aws-slackbot-template
Cloudformation template to create a Slack bot backend via Lambda and API Gateway

# What Do These Files Do?
index.js - Contains all the code to handle recieving/sending to/from Slack. You should not need to modify this file.
slack_bot_template.yaml - The AWS SAM Cloudformation template. You may want to modify this to add/modify AWS resources.
bot_response.js - Contains the Slack bot handler function. This is where you bot code will go.

The only code that you will need to modify is the function inside bot_response.js
```
module.exports = (slack_event, context) => {
    return "You said: " + slack_event["text"];
};
```

# How to Build

## Prerequisites
1. AWS CLI
2. Read and Write access to an S3 bucket
3. A [Slack Bot User](https://api.slack.com/bot-users)

## Build and Deploy
This cloudformation template uses [AWS SAM](https://github.com/awslabs/serverless-application-model/blob/master/HOWTO.md) to be generated.
1. Run 
```
aws cloudformation package \
    --template-file slack_bot_template.yaml \
    --s3-bucket <BUCKET_NAME> \
    --output-template-file <OUTPUT_YAML>
```
This command will package and upload the Lambda code to the S3 bucket BUCKET_NAME and generate a new cloudformation yaml file OUTPUT_YAML.

2. Create a cloudformation stack using OUTPUT_YAML
3. Enter SLACK_VERIFICATION_TOKEN and BOT_OAUTH_ACCESS_TOKEN Slack variables. These can be found in your Slack App.
4. Finish creating the template. This will create a Lambda function that handles Slack events and an API Gateway to expose the Lambda function.
5. In the new cloudformation stack go to Resources -> ServerlessRestApi -> Stages. Find the Invoke Url for which stage you want your Slack App to point to.
6. In your Slack App go to Event Subscriptions. Enable events and put the Invoke Url as the Request Url. Once verified Slack will forward events to your API.

### Test Slack App
In Slack send a message to your bot. You should get a response: 'You said: <Your Message>'
import os, json
import boto3

personalize_runtime = boto3.client('personalize-runtime')

realtime_campaign_arn = os.environ["PERSONALIZE_REALTIME_CAMPAIGN_ARN"]

def lambda_handler(event, context):
    try:
        body = json.loads(event["body"])
        user_id = body["userId"]

        get_recommendations_response = personalize_runtime.get_recommendations(
            campaignArn = realtime_campaign_arn,
            userId = str(user_id),
        )

        response = {
            "isBase64Encoded": False,
            "statusCode": 200,
            "headers": { },
            "body": json.dumps(get_recommendations_response)
        }

        return response
    except Exception as exception:
        exceptionDictionary = {
            "message": str(exception),
            "type": exception.__class__.__name__
        }

        response = {
            "isBase64Encoded": False,
            "statusCode": 500,
            "headers": { },
            "body": json.dumps(exceptionDictionary)
        }

        return response

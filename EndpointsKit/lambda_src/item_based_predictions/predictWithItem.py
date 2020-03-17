import os, json
import boto3

personalize_runtime = boto3.client('personalize-runtime')

campaign_arn = os.environ["PERSONALIZE_CAMPAIGN_ARN"]

def lambda_handler(event, context):
    body = json.loads(event["body"])
    item_id = body["itemId"]

    get_recommendations_response = personalize_runtime.get_recommendations(
        campaignArn = campaign_arn,
        itemId = str(item_id),
    )

    response = {
        "isBase64Encoded": False,
        "statusCode": 200,
        "headers": { },
        "body": json.dumps(get_recommendations_response)
    }

    return response

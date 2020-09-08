import os, json
import boto3

personalize_runtime = boto3.client('personalize-runtime')

rerank_campaign_arn = os.environ["PERSONALIZE_RERANK_CAMPAIGN_ARN"]

def lambda_handler(event, context):
    try:
        body = json.loads(event["body"])
        user_id = body["userId"]
        item_list = body["items"]
        item_list_to_be_reranked = list(map(lambda item: str(item["itemId"]), item_list))

        get_recommendations_response_rerank = personalize_runtime.get_personalized_ranking(
            campaignArn = rerank_campaign_arn,
            userId = str(user_id),
            inputList = item_list_to_be_reranked
        )

        response = {
            "isBase64Encoded": False,
            "statusCode": 200,
            "headers": { },
            "body": json.dumps(get_recommendations_response_rerank)
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

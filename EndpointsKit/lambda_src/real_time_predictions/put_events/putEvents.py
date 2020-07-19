import os, json
import boto3

personalize_events = boto3.client(service_name='personalize-events')

event_tracker_arn = os.environ["EVENT_TRACKER_ARN"]
tracking_id       = os.environ["TRACKING_ID"]

def lambda_handler(event, context):
    body = json.loads(event["body"])
    events = body["events"]

    user_id = body["userId"]
    session_id = body["sessionId"]

    put_events_response = personalize_events.put_events(
        trackingId = tracking_id,
        userId     = str(user_id),
        sessionId  = session_id,
        eventList  = events
    )

    response = {
        "isBase64Encoded": False,
        "statusCode": 200,
        "headers": { },
        "body": json.dumps({"underlyingPersonalizeResponse": put_events_response})
    }

    return response
import os, json
import boto3
from aws_lambda_powertools import Tracer, Logger, Metrics
TRACER = Tracer(service=__name__)
LOGGER = Logger()
METRICS = Metrics()


personalize_events = boto3.client(service_name='personalize-events')
event_tracker_arn = os.environ["EVENT_TRACKER_ARN"]
tracking_id       = os.environ["TRACKING_ID"]


@TRACER.capture_lambda_handler
@LOGGER.inject_lambda_context
@METRICS.log_metrics
def lambda_handler(event, context):
    try:
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

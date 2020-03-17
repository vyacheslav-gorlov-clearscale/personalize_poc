import * as CDK from '@aws-cdk/core'
import * as Lambda from "@aws-cdk/aws-lambda"
import { PersonalizeLambdaRole } from "./personalizeLambdaRole"
import { Duration } from "@aws-cdk/core"

export class LambdaPutEvents extends Lambda.Function{

    constructor(scope: CDK.Construct) {
        const lambdaName = "lambdaPutEvents"

        const lambdaRole = new PersonalizeLambdaRole(scope, lambdaName)

        const eventTrackerArn = process.env["EVENT_TRACKER_ARN"] || "<MAILFORMED ARN>"
        const trackingId = process.env["TRACKING_ID"] || "<MAILFORMED TRACKING ID>"

        super(scope, lambdaName, {
            runtime: Lambda.Runtime.PYTHON_3_8,
            handler: "putEvents.lambda_handler",
            role: lambdaRole,
            code: new Lambda.AssetCode("lambda_src/real_time_predictions/put_events"),
            environment: {
                "EVENT_TRACKER_ARN": eventTrackerArn,
                "TRACKING_ID": trackingId
            },
            memorySize: 256,
            timeout: Duration.minutes(15)
        });
    }

}

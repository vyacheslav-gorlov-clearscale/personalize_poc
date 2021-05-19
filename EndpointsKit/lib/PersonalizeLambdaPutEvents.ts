import { Duration, aws_lambda } from "aws-cdk-lib"
import { Construct } from "constructs"


import { PersonalizeBundlingOptions } from "./PersonalizeLambdaBundingOptions"
import { PersonalizeLambdaRole } from "./PersonalizeLambdaRole"
import { LambdaLayerType, PersonalizeLambdaLayersFactory } from "./PersonalizeLambdaLayersFactory"


export class PersonalizeLambdaPutEvents extends aws_lambda.Function {

    constructor(scope: Construct) {

        const lambdaName = "PersonalizeLambdaPutEvents"
        const lambdaRole = new PersonalizeLambdaRole(scope, lambdaName)
        const eventTrackerArn = process.env["EVENT_TRACKER_ARN"] || "<MAILFORMED ARN>"
        const trackingId = process.env["TRACKING_ID"] || "<MAILFORMED TRACKING ID>"

        super(scope, lambdaName, {
            runtime: aws_lambda.Runtime.PYTHON_3_8,
            handler: "PutEvents.lambda_handler",
            role: lambdaRole,
            code: aws_lambda.Code.fromAsset("lambda_src/real_time_predictions/put_events", {
                bundling: PersonalizeBundlingOptions.Python
            }),
            environment: {
                "EVENT_TRACKER_ARN": eventTrackerArn,
                "TRACKING_ID": trackingId
            },
            memorySize: 256,
            timeout: Duration.minutes(15),
            tracing: aws_lambda.Tracing.ACTIVE,
            layers: [
                PersonalizeLambdaLayersFactory.sharedInstance.getLayerWithType(LambdaLayerType.LAMBDA_INSIGHTS)
            ]
        })
    }

}

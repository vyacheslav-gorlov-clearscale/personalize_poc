import { Duration, aws_lambda } from "aws-cdk-lib"
import { Construct } from "constructs"

import { PersonalizeLambdaRole } from "./PersonalizeLambdaRole"
import { PersonalizeBundlingOptions } from "./PersonalizeLambdaBundingOptions"
import { PersonalizeLambdaEnhancedMonitoringLayer } from "./PersonalizeLambdaEnhancedMonitoringLayer"


export class PersonalizeLambdaPredictWithUser extends aws_lambda.Function {

    constructor(scope: Construct) {

        const lambdaName = "lambdaPredictWithUser"
        const lambdaRole = new PersonalizeLambdaRole(scope, lambdaName)
        const personalizeRealtimeCampaignArn = process.env["PERSONALIZE_REALTIME_CAMPAIGN_ARN"] || "<MAILFORMED ARN>"

        super(scope, lambdaName, {
            runtime: aws_lambda.Runtime.PYTHON_3_8,
            role: lambdaRole,
            handler: "predictWithUser.lambda_handler",
            code: aws_lambda.Code.fromAsset("lambda_src/real_time_predictions/predict_with_user", {
                bundling: PersonalizeBundlingOptions.Python
            }),
            environment: {
                "PERSONALIZE_REALTIME_CAMPAIGN_ARN": personalizeRealtimeCampaignArn
            },
            memorySize: 256,
            timeout: Duration.minutes(15),
            tracing: aws_lambda.Tracing.ACTIVE,
            layers: [
                PersonalizeLambdaEnhancedMonitoringLayer.fromScope(scope)
            ]
        })

    }

}

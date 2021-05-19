import { Duration, aws_lambda } from "aws-cdk-lib"
import { Construct } from "constructs"


import { PersonalizeLambdaRole } from "./PersonalizeLambdaRole"
import { PersonalizeLambdaBundlingOptions } from "./PersonalizeLambdaBundingOptions"
import { LambdaLayerType, PersonalizeLambdaLayersFactory } from "./PersonalizeLambdaLayersFactory"


export class PersonalizeLambdaPredictWithUser extends aws_lambda.Function {

    constructor(scope: Construct) {

        const lambdaName = "PersonalizeLambdaPredictWithUser"
        const lambdaRole = new PersonalizeLambdaRole(scope, lambdaName)
        const personalizeRealtimeCampaignArn = process.env["PERSONALIZE_REALTIME_CAMPAIGN_ARN"] || "<MAILFORMED ARN>"

        super(scope, lambdaName, {
            runtime: aws_lambda.Runtime.PYTHON_3_8,
            role: lambdaRole,
            handler: "PredictWithUser.lambda_handler",
            code: aws_lambda.Code.fromAsset("lambda_src/real_time_predictions/predict_with_user", {
                bundling: PersonalizeLambdaBundlingOptions.PYTHON
            }),
            environment: {
                "PERSONALIZE_REALTIME_CAMPAIGN_ARN": personalizeRealtimeCampaignArn
            },
            memorySize: 256,
            timeout: Duration.minutes(15),
            tracing: aws_lambda.Tracing.ACTIVE,
            layers: [
                PersonalizeLambdaLayersFactory.sharedInstance.getManagedLayerWithType(LambdaLayerType.LAMBDA_INSIGHTS)
            ]
        })

    }

}

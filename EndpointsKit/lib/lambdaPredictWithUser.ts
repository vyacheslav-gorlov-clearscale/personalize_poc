import * as CDK from '@aws-cdk/core'
import * as Lambda from "@aws-cdk/aws-lambda"
import { PersonalizeLambdaRole } from "./personalizeLambdaRole"
import { Duration } from "@aws-cdk/core"

export class LambdaPredictWithUser extends Lambda.Function {

    constructor(scope: CDK.Construct) {

        const lambdaName = "lambdaPredictWithUser"

        const lambdaRole = new PersonalizeLambdaRole(scope, lambdaName)

        const personalizeRealtimeCampaignArn = process.env["PERSONALIZE_REALTIME_CAMPAIGN_ARN"] || "<MAILFORMED ARN>"

        super(scope, lambdaName, {
            runtime: Lambda.Runtime.PYTHON_3_8,
            role: lambdaRole,
            handler: "predictWithUser.lambda_handler",
            code: new Lambda.AssetCode("lambda_src/real_time_predictions/predict_with_user"),
            environment: {
                "PERSONALIZE_REALTIME_CAMPAIGN_ARN": personalizeRealtimeCampaignArn
            },
            memorySize: 256,
            timeout: Duration.minutes(15)
        })



    }

}

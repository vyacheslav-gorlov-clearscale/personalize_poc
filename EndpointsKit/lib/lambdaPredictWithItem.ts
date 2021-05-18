import { Duration, aws_lambda } from "aws-cdk-lib"
import { Construct } from "constructs"

import { PersonalizeLambdaRole } from "./personalizeLambdaRole"
import { PersonalizeBundlingOptions } from "./personalizeBundingOptions"


export class LambdaPredictWithItem extends aws_lambda.Function {

    constructor(scope: Construct) {

        const lambdaName = "lambdaPredictWithItem"
        const lambdaRole = new PersonalizeLambdaRole(scope, lambdaName)
        const personalizeCampaignArn = process.env["PERSONALIZE_CAMPAIGN_ARN"] || "<MAILFORMED PERSONALIZE CAMPAIGN ARN>"

        super(scope, lambdaName, {
            runtime: aws_lambda.Runtime.PYTHON_3_8,
            handler: "predictWithItem.lambda_handler",
            code: aws_lambda.Code.fromAsset("lambda_src/item_based_predictions", {
                bundling: PersonalizeBundlingOptions.Python
            }),
            role: lambdaRole,
            environment: {
                "PERSONALIZE_CAMPAIGN_ARN": personalizeCampaignArn
            },
            memorySize: 256,
            timeout: Duration.minutes(3),
            tracing: aws_lambda.Tracing.ACTIVE
        })

    }
}

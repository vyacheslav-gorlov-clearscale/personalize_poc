import * as CDK from '@aws-cdk/core'
import * as Lambda from "@aws-cdk/aws-lambda"
import { Duration } from "@aws-cdk/core"

import { PersonalizeLambdaRole } from "./personalizeLambdaRole"

export class LambdaPredictWithItem extends Lambda.Function {

    constructor(scope: CDK.Construct) {

        const lambdaName = "lambdaPredictWithItem"

        const lambdaRole = new PersonalizeLambdaRole(scope, lambdaName)

        const personalizeCampaignArn = process.env["PERSONALIZE_CAMPAIGN_ARN"] || "<MAILFORMED PERSONALIZE CAMPAIGN ARN>"

        super(scope, lambdaName, {
            runtime: Lambda.Runtime.PYTHON_3_8,
            handler: "predictWithItem.lambda_handler",
            code: new Lambda.AssetCode("lambda_src/item_based_predictions"),
            role: lambdaRole,
            environment: {
                "PERSONALIZE_CAMPAIGN_ARN": personalizeCampaignArn
            },
            memorySize: 256,
            timeout: Duration.minutes(3)
        })
    }

}

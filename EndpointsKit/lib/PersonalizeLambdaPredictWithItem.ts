import {aws_lambda, Duration} from "aws-cdk-lib"
import {Construct} from "constructs"

import {PersonalizeLambdaRole} from "./PersonalizeLambdaRole"
import {PersonalizeBundlingOptions} from "./PersonalizeLambdaBundingOptions"
import { LambdaLayerType, PersonalizeLambdaLayersFactory } from "./PersonalizeLambdaLayersFactory"


export class PersonalizeLambdaPredictWithItem extends aws_lambda.Function {

    constructor(scope: Construct) {

        const lambdaName = "PersonalizeLambdaPredictWithItem"
        const lambdaRole = new PersonalizeLambdaRole(scope, lambdaName)
        const personalizeCampaignArn = process.env["PERSONALIZE_CAMPAIGN_ARN"] || "<MAILFORMED PERSONALIZE CAMPAIGN ARN>"

        super(scope, lambdaName, {
            runtime: aws_lambda.Runtime.PYTHON_3_8,
            handler: "PredictWithItem.lambda_handler",
            code: aws_lambda.Code.fromAsset("lambda_src/item_based_predictions", {
                bundling: PersonalizeBundlingOptions.Python
            }),
            role: lambdaRole,
            environment: {
                "PERSONALIZE_CAMPAIGN_ARN": personalizeCampaignArn
            },
            memorySize: 256,
            timeout: Duration.minutes(3),
            tracing: aws_lambda.Tracing.ACTIVE,
            layers: [
                PersonalizeLambdaLayersFactory.sharedInstance.getLayerWithType(LambdaLayerType.LAMBDA_INSIGHTS)
            ]
        })

    }
}

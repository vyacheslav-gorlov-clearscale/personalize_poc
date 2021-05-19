import { Duration, aws_lambda } from "aws-cdk-lib"
import { Construct } from 'constructs'


import { PersonalizeLambdaRole } from "./PersonalizeLambdaRole"
import { PersonalizeBundlingOptions } from "./PersonalizeLambdaBundingOptions"
import { LambdaLayerType, PersonalizeLambdaLayersFactory } from "./PersonalizeLambdaLayersFactory";


export class PersonalizeLambdaRerankArrayWithUser extends aws_lambda.Function {

    constructor(scope: Construct) {

        const lambdaName = "PersonalizeLambdaRerankArrayWithUser"
        const lambdaRole = new PersonalizeLambdaRole(scope, lambdaName)
        const personalizeRerankCampaignArn = process.env["PERSONALIZE_RERANK_CAMPAIGN_ARN"] || "<MAILFORMED ARN>"

        super(scope, lambdaName, {
            runtime: aws_lambda.Runtime.PYTHON_3_8,
            role: lambdaRole,
            handler: `RerankArrayWithUser.lambda_handler`,
            code: aws_lambda.Code.fromAsset("lambda_src/search_results_reranking", {
                bundling: PersonalizeBundlingOptions.Python
            }),
            environment: {
                "PERSONALIZE_RERANK_CAMPAIGN_ARN": personalizeRerankCampaignArn
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


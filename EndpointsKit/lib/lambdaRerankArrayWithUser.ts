import { Duration, aws_lambda } from "aws-cdk-lib"
import { Construct } from 'constructs'

import { PersonalizeLambdaRole } from "./personalizeLambdaRole"
import { PersonalizeBundlingOptions } from "./personalizeBundingOptions"


export class LambdaRerankArrayWithUser extends aws_lambda.Function {

    constructor(scope: Construct) {

        const lambdaName = "lambdaRerankArrayWithUser"
        const lambdaRole = new PersonalizeLambdaRole(scope, lambdaName)
        const personalizeRerankCampaignArn = process.env["PERSONALIZE_RERANK_CAMPAIGN_ARN"] || "<MAILFORMED ARN>"

        super(scope, lambdaName, {
            runtime: aws_lambda.Runtime.PYTHON_3_8,
            role: lambdaRole,
            handler: `rerankArrayWithUser.lambda_handler`,
            code: aws_lambda.Code.fromAsset("lambda_src/search_results_reranking", {
                bundling: PersonalizeBundlingOptions.Python
            }),
            environment: {
                "PERSONALIZE_RERANK_CAMPAIGN_ARN": personalizeRerankCampaignArn
            },
            memorySize: 256,
            timeout: Duration.minutes(15),
            tracing: aws_lambda.Tracing.ACTIVE
        })

    }

}


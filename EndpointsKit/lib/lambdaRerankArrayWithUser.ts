import * as CDK from '@aws-cdk/core'
import * as Lambda from "@aws-cdk/aws-lambda"
import { PersonalizeLambdaRole } from "./personalizeLambdaRole"
import { Duration } from "@aws-cdk/core"

export class LambdaRerankArrayWithUser extends Lambda.Function {

    constructor(scope: CDK.Construct) {

        const lambdaName = "lambdaRerankArrayWithUser"

        const lambdaRole = new PersonalizeLambdaRole(scope, lambdaName)

        const personalizeRerankCampaignArn = process.env["PERSONALIZE_RERANK_CAMPAIGN_ARN"] || "<MAILFORMED ARN>"

        super(scope, lambdaName, {
            runtime: Lambda.Runtime.PYTHON_3_8,
            role: lambdaRole,
            handler: `rerankArrayWithUser.lambda_handler`,
            code: new Lambda.AssetCode("lambda_src/search_results_reranking"),
            environment: {
                "PERSONALIZE_RERANK_CAMPAIGN_ARN": personalizeRerankCampaignArn
            },
            memorySize: 256,
            timeout: Duration.minutes(15)
        });
    }

}


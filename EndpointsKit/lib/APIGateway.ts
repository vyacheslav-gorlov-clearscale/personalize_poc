import { aws_apigateway } from "aws-cdk-lib"
import { Construct } from 'constructs'

import { LambdaPredictWithItem } from "./lambdaPredictWithItem"
import { LambdaRerankArrayWithUser } from "./lambdaRerankArrayWithUser"
import { LambdaPutEvents } from "./lambdaPutEvents"
import { LambdaPredictWithUser } from "./lambdaPredictWithUser"

export class APIGateway extends aws_apigateway.RestApi {

    constructor(scope: Construct) {
        super(scope, "PersonalizeAPIGateway")

        // MARK: - Item-based Predictions
        const itemPredictions = this.root.addResource("item_predictions")

        const predictWithItemLambda = new LambdaPredictWithItem(scope)
        const predictWithItemIntegration = new aws_apigateway.LambdaIntegration(predictWithItemLambda, {
            proxy: true
        })
        itemPredictions.addMethod("POST", predictWithItemIntegration)

        // MARK: - Search Results Reranking
        const searchResultsReranking = this.root.addResource("search_results_reranking")

        const rerankArrayWithUserLambda = new LambdaRerankArrayWithUser(scope)
        const rerankArrayWithUserIntegration = new aws_apigateway.LambdaIntegration(rerankArrayWithUserLambda, {
            proxy: true
        })
        searchResultsReranking.addMethod("POST", rerankArrayWithUserIntegration)

        // MARK: - Real-Time Predictions
        const realTimePredictions = this.root.addResource("real_time_predictions")

        // Actually, it doesn't throw anything but required to make a nested block
        try {
            const events = realTimePredictions.addResource("events")

            const putEventsLambda = new LambdaPutEvents(scope)
            const putEventsIntegration = new aws_apigateway.LambdaIntegration(putEventsLambda, {
                proxy: true
            })
            events.addMethod("POST", putEventsIntegration)

            const predictions = realTimePredictions.addResource("predictions")
            const predictWithUserLambda = new LambdaPredictWithUser(scope)
            const predictWithUserIntegration = new aws_apigateway.LambdaIntegration(predictWithUserLambda, {
                proxy: true
            })
            predictions.addMethod("POST", predictWithUserIntegration)
        } finally { }

    }

}

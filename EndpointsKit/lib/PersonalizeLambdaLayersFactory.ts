import { aws_lambda } from "aws-cdk-lib"
import { Construct } from "constructs"


export enum LambdaLayerType {

    /**
     * If your Lambdas run within the VPC, do not forget to attach a VPC Interface Endpoints for Amazon CloudWatch Logs as described [here](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights-Getting-Started-clouddevelopmentkit.html)
     */
    LAMBDA_INSIGHTS = "LAMBDA_INSIGHTS"
}

export class PersonalizeLambdaLayersFactory {

    private constructor() { }

    private static _sharedInstance?: PersonalizeLambdaLayersFactory
    public static get sharedInstance(): PersonalizeLambdaLayersFactory {
        if (this._sharedInstance === undefined) {
            this._sharedInstance = new PersonalizeLambdaLayersFactory()
        }

        return this._sharedInstance
    }

    private static _scope: Construct
    static loadWithScope(scope: Construct) {
        this._scope = scope
    }

    private storage: Map<LambdaLayerType, aws_lambda.ILayerVersion> = new Map()

    public getLayerWithType(lambdaLayerType: LambdaLayerType): aws_lambda.ILayerVersion {
        switch (lambdaLayerType) {
            case LambdaLayerType.LAMBDA_INSIGHTS:
                let layer = this.storage.get(lambdaLayerType)

                if (layer === undefined) {
                    const layerArn = `arn:aws:lambda:${process.env.CDK_DEFAULT_REGION}:580247275435:layer:LambdaInsightsExtension:14`
                    layer = aws_lambda.LayerVersion.fromLayerVersionArn(PersonalizeLambdaLayersFactory._scope, `PersonalizeLambdaEnhancedMonitoringLayer`, layerArn)
                    this.storage.set(lambdaLayerType, layer)
                }

                return layer
            default:
                throw new Error(`Unrecognized LambdaLayerType received - ${lambdaLayerType}`)
        }
    }

}
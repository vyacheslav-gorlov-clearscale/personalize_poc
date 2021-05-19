import { aws_lambda } from "aws-cdk-lib"
import { Construct } from "constructs"
import { PersonalizeLambdaBundlingOptions } from "./PersonalizeLambdaBundingOptions"


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

    private storage: Map<string, aws_lambda.ILayerVersion> = new Map()

    public getCustomLayerWithName(layerName: string, bundlingOptions: PersonalizeLambdaBundlingOptions): aws_lambda.ILayerVersion {
        if (layerName === "") {
            throw new Error("`layerName` should not be empty")
        }

        const layerKey = `CUSTOM_${layerName}`
        let customLayer = this.storage.get(layerKey)
        if (customLayer === undefined) {
            customLayer = new aws_lambda.LayerVersion(PersonalizeLambdaLayersFactory._scope, layerName, {
                code: aws_lambda.Code.fromAsset(`lambda_src/layers/${layerName}`, {
                    bundling: bundlingOptions
                })
            })
            this.storage.set(layerKey, customLayer)
        }

        return customLayer
    }

    public getManagedLayerWithType(lambdaLayerType: LambdaLayerType): aws_lambda.ILayerVersion {
        switch (lambdaLayerType) {
            case LambdaLayerType.LAMBDA_INSIGHTS:
                let lambdaInsightsLayer = this.storage.get(lambdaLayerType)
                if (lambdaInsightsLayer === undefined) {
                    const layerArn = `arn:aws:lambda:${process.env.CDK_DEFAULT_REGION}:580247275435:layer:LambdaInsightsExtension:14`
                    lambdaInsightsLayer = aws_lambda.LayerVersion.fromLayerVersionArn(PersonalizeLambdaLayersFactory._scope, `LambdaInsightsLayer`, layerArn)
                    this.storage.set(lambdaLayerType, lambdaInsightsLayer)
                }

                return lambdaInsightsLayer
            default:
                throw new Error(`Unrecognized LambdaLayerType received - ${lambdaLayerType}`)
        }
    }

}
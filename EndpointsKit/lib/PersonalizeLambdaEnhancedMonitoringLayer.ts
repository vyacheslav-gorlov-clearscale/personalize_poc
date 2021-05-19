import {aws_lambda} from "aws-cdk-lib"
import {Construct} from "constructs"


export class PersonalizeLambdaEnhancedMonitoringLayer {

    private constructor() { }

    private static _sharedInstance: aws_lambda.ILayerVersion

    public static get sharedInstance(): aws_lambda.ILayerVersion {
        if (this.sharedInstance === null) {
            const layerArn = `arn:aws:lambda:${process.env.CDK_DEFAULT_REGION}:580247275435:layer:LambdaInsightsExtension:14`
            this._sharedInstance = aws_lambda.LayerVersion.fromLayerVersionArn(scope, `PersonalizeLambdaEnhancedMonitoringLayer.sharedInstance`, layerArn)
        }

        return this._sharedInstance
    }

    static fromScope(scope: Construct): aws_lambda.ILayerVersion {
        const layerArn = `arn:aws:lambda:${process.env.CDK_DEFAULT_REGION}:580247275435:layer:LambdaInsightsExtension:14`
        return aws_lambda.LayerVersion.fromLayerVersionArn(scope, `PersonalizeLambdaEnhancedMonitoringLayer`, layerArn)
    }

}
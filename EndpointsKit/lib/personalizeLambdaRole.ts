import * as CDK from "@aws-cdk/core"
import * as IAM from "@aws-cdk/aws-iam"

export class PersonalizeLambdaRole extends IAM.Role {

    constructor(scope: CDK.Construct, prefix: string) {
        super(scope, `${prefix}PersonalizeLambdaExecutionRole`, {
            assumedBy: new IAM.ServicePrincipal("lambda.amazonaws.com"),
            path: "/",
            managedPolicies: [
                IAM.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"),
                IAM.ManagedPolicy.fromAwsManagedPolicyName("service-role/AmazonPersonalizeFullAccess")
            ]
        })
    }

}

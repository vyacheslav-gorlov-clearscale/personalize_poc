import { aws_iam } from "aws-cdk-lib"
import { Construct } from 'constructs'


export class PersonalizeLambdaRole extends aws_iam.Role {

    constructor(scope: Construct, prefix: string) {

        super(scope, `${prefix}PersonalizeLambdaExecutionRole`, {
            assumedBy: new aws_iam.ServicePrincipal("lambda.amazonaws.com"),
            path: "/",
            managedPolicies: [
                aws_iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"),
                aws_iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AmazonPersonalizeFullAccess"),
                aws_iam.ManagedPolicy.fromAwsManagedPolicyName("AWSXrayFullAccess")
            ]
        })

    }

}

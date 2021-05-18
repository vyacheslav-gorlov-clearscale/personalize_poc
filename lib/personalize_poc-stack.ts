import { Stack, StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import { aws_iam, aws_sagemaker } from "aws-cdk-lib"


export class PersonalizePocStack extends Stack {

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const iamRole = new aws_iam.Role(this, "NotebookInstanceRole", {
      assumedBy: new aws_iam.ServicePrincipal("sagemaker.amazonaws.com"),
      path: "/",
      managedPolicies: [
        aws_iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSageMakerFullAccess"),
        aws_iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess"),
        aws_iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AmazonPersonalizeFullAccess"),
        aws_iam.ManagedPolicy.fromAwsManagedPolicyName("IAMFullAccess")
      ]
    });

    // noinspection JSUnusedLocalSymbols
    const sageMakerInstance = new aws_sagemaker.CfnNotebookInstance(this, "NotebookInstance", {
      instanceType: "ml.t3.medium",
      roleArn: iamRole.roleArn,
      notebookInstanceName: "Personalize-POC",
      defaultCodeRepository: "https://github.com/gorlov-clearscale/personalize_poc.git",
      volumeSizeInGb: 20
    })

  }

}
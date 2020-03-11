import * as cdk from '@aws-cdk/core';
import { CfnNotebookInstance } from '@aws-cdk/aws-sagemaker';
import { Role, ManagedPolicy, ServicePrincipal } from "@aws-cdk/aws-iam";

export class PersonalizePocStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const iamRole = new Role(this, "NotebookInstanceRole", {
      assumedBy: new ServicePrincipal("sagemaker.amazonaws.com"),
      path: "/",
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName("AmazonSageMakerFullAccess"),
        ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess"),
        ManagedPolicy.fromAwsManagedPolicyName("service-role/AmazonPersonalizeFullAccess"),
        ManagedPolicy.fromAwsManagedPolicyName("IAMFullAccess")
      ]
    });

    // noinspection JSUnusedLocalSymbols
    const sageMakerInstance = new CfnNotebookInstance(this, "NotebookInstance", {
      instanceType: "ml.t3.medium",
      roleArn: iamRole.roleArn,
      notebookInstanceName: "Personalize-POC",
      defaultCodeRepository: "https://github.com/gorlov-clearscale/personalize_poc.git",
      volumeSizeInGb: 20
    });
  }
}

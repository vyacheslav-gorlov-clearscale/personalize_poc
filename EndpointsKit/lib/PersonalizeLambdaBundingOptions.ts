import { aws_lambda, BundlingOptions, DockerImage } from "aws-cdk-lib"


export class PersonalizeLambdaBundlingOptions implements BundlingOptions {

    // Specify Docker image:
    image: DockerImage
    // The build command to be executed within the Docker container:
    command: string[]
    user: string

    constructor(image: DockerImage, command: string[], user: string) {
        this.image = image
        this.command = command
        this.user = user
    }

    static PYTHON = new PersonalizeLambdaBundlingOptions(
        aws_lambda.Runtime.PYTHON_3_8.bundlingImage,
        [
            "bash", "-c", [
            `pip install -r requirements.txt -t /asset-output`,
            `cp -au . /asset-output`
            ].join(" && ")
        ],
        "root"
    )

}
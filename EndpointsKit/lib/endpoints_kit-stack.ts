import * as CDK from '@aws-cdk/core'
import * as fs from "fs"
import * as path from "path"
import { APIGateway } from "./APIGateway"

export class EndpointsKitStack extends CDK.Stack {

  constructor(scope: CDK.Construct, id: string, props?: CDK.StackProps) {
    const envDictionaryString = fs.readFileSync(path.join(__dirname, "env.json"), {encoding: "utf8"})
    const envDictionary = JSON.parse(envDictionaryString)
    process.env["PERSONALIZE_CAMPAIGN_ARN"] = envDictionary["personalizeCampaignArn"]
    process.env["PERSONALIZE_RERANK_CAMPAIGN_ARN"] = envDictionary["personalizeRerankCampaignArn"]
    process.env["EVENT_TRACKER_ARN"] = envDictionary["eventTrackerArn"]
    process.env["TRACKING_ID"] = envDictionary["trackingId"]
    process.env["PERSONALIZE_REALTIME_CAMPAIGN_ARN"] = envDictionary["personalizeRealtimeCampaignArn"]

    super(scope, id, props)

    new APIGateway(this)
  }

}

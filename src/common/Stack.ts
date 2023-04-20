import { Construct } from "constructs";
import { TerraformStack } from "cdktf";
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { Environment, CloudEnvironment, Subscription, Region } from "./Environment";

export class Stack extends TerraformStack {
    region: Region;
    cloudEnvironment: CloudEnvironment
    subscription: Subscription

    constructor(scope: Construct, id: string, env: Environment) {
        super(scope, id);

        this.region = env.region
        this.cloudEnvironment = env.cloudEnvironment ?? "public"
        this.subscription = env.subscription

        new AzurermProvider(this, "azure-rm-provider", {
            features: {},
            subscriptionId: this.subscription,
            environment: this.cloudEnvironment
        });
    }
}

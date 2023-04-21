import { Construct } from "constructs";
import { TerraformStack, AzurermBackend } from "cdktf";
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { Environment, CloudEnvironment, Subscription, Region } from "./Environment";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";

export class Stack extends TerraformStack {
    region: Region;
    cloudEnvironment: CloudEnvironment
    subscription: Subscription
    resourceGroup: ResourceGroup

    constructor(scope: Construct, id: string, env: Environment) {
        super(scope, Stack.getUniqueName(id, env));

        this.region = env.region
        this.cloudEnvironment = env.cloudEnvironment ?? "public"
        this.subscription = env.subscription

        new AzurermProvider(this, "azure-rm-provider", {
            features: {},
            subscriptionId: this.subscription,
            environment: this.cloudEnvironment
        });

        new AzurermBackend(this, {
            storageAccountName: "cdttf4cjostorage",
            containerName: "tfstate",
            key: Stack.getUniqueName(id, env),
            resourceGroupName: "prod-infra-pipeline-westeurope"
        });

        this.resourceGroup = new ResourceGroup(this, "resource-group", {
            location: this.region,
            name: Stack.getUniqueName(id, env)
        });
    }

    static getUniqueName(id: string, env: Environment, separator: string = "-") : string {
        // TODO: add name restriction
        // "/^[a-z]+$/i.test(str);" or custom type should be added
        // can be covered with tests
        // neither arm nor bicep can do that =)

        const result = `${env.name}${separator}${id}${separator}${env.region}`

        // assume "public" as default and omit to avoid any confusion on meaning, but have to add others as suffix
        if(env.cloudEnvironment && env.cloudEnvironment != "public") {
            return `${result}${separator}${env.cloudEnvironment}`
        }

        return result
    }
}

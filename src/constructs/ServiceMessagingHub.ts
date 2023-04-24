import { Construct } from "constructs";
import { Environment } from "../common/Environment";
import { Stack } from "../common/Stack";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { Eventhub } from "@cdktf/provider-azurerm/lib/eventhub";
import { EventhubNamespace } from "@cdktf/provider-azurerm/lib/eventhub-namespace";
import { StorageAccount } from "@cdktf/provider-azurerm/lib/storage-account";
import { StorageContainer } from "@cdktf/provider-azurerm/lib/storage-container";

export interface ServiceMessagingHubProps {
    env: Environment,
    resourceGroup: ResourceGroup,
    hubs: string[]
}

export class ServiceMessagingHub extends Construct {
    constructor(scope: Construct, serviceName: string, props: ServiceMessagingHubProps) {
        super(scope, Stack.getUniqueName(`${serviceName}-messaging-hub`, props.env));
        const { env, resourceGroup, hubs } = props;

        const eventhubNamespace = new EventhubNamespace(this, "event-hub-namespace", {
            resourceGroupName: resourceGroup.name,
            location: env.region,
            name: Stack.getUniqueName(`${serviceName}`, env),
            sku: "Standard",
        })

        const account = new StorageAccount(this, "storage-account", {
            location: env.region,
            accountTier: "Standard",
            accountReplicationType: "LRS",
            resourceGroupName: resourceGroup.name,
            name: Stack.getUniqueName(`${serviceName}`, env, ""),
        })

        hubs.forEach(hub => {
            new Eventhub(this, `${hub}-event-hub`, {
                resourceGroupName: resourceGroup.name,
                namespaceName: eventhubNamespace.name,
                name: hub,
                messageRetention: 1,
                partitionCount: 2,  
            })

            new Eventhub(this, `${hub}-event-hub-dlq`, {
                resourceGroupName: resourceGroup.name,
                namespaceName: eventhubNamespace.name,
                name: hub,
                messageRetention: 1,
                partitionCount: 2,  
            })

            new StorageContainer(this, `${hub}-storage-container`, {
                name: `${hub}`,
                storageAccountName: account.name,
            })
        })
    }
}
import { Construct } from "constructs";
import { ServiceStack } from "../../common/ServiceStack";
import { Environment } from "../../common/Environment";
import { StorageAccount } from "@cdktf/provider-azurerm/lib/storage-account";
import { StorageContainer } from "@cdktf/provider-azurerm/lib/storage-container";

export class InfraPipelineStack extends ServiceStack {
    constructor(scope: Construct, env: Environment) {
        super(scope, "infra-pipeline", env);

        const account = new StorageAccount(this, "storage-account", {
            location: this.region,
            accountTier: "Standard",
            accountReplicationType: "LRS",
            resourceGroupName: this.resourceGroup.name,
            name: "cdttf4cjostorage",
        })

        new StorageContainer(this, "storage-container", {
            name: "tfstate",
            storageAccountName: account.name,
        })
    }
}

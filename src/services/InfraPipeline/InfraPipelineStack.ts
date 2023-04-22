import { Construct } from "constructs";
import { ServiceStack } from "../../common/ServiceStack";
import { Environment } from "../../common/Environment";
import { UserAssignedIdentity } from "@cdktf/provider-azurerm/lib/user-assigned-identity";
import { RoleAssignment } from "@cdktf/provider-azurerm/lib/role-assignment";
import { StorageAccount } from "@cdktf/provider-azurerm/lib/storage-account";
import { StorageContainer } from "@cdktf/provider-azurerm/lib/storage-container";
import { ContainerRegistry } from "@cdktf/provider-azurerm/lib/container-registry";

export class InfraPipelineStack extends ServiceStack {
    constructor(scope: Construct, env: Environment) {
        super(scope, "infra-pipeline", env);

        const identity = new UserAssignedIdentity(this, "user-identity", {
            location: this.region,
            name: ServiceStack.getUniqueName("infra-pipeline-identity", env),
            resourceGroupName: this.resourceGroup.name,
        })

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

        new RoleAssignment(this, "role", {
            principalId: identity.principalId,
            scope: `/subscriptions/${this.subscription}/resourceGroups/${this.resourceGroup.name}`,
            roleDefinitionName: "Storage Blob Data Owner",
        })

        new ContainerRegistry(this, "container-registry", {
            location: this.region,
            name: "cdktf4cjo",
            sku: "Basic",
            resourceGroupName: this.resourceGroup.name,
        })
    }
}

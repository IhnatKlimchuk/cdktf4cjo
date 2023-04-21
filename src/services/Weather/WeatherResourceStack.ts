import { Construct } from "constructs";
import { Environment } from "../../common/Environment";
import { ServiceStack } from "../../common/ServiceStack";
import { UserAssignedIdentity } from "@cdktf/provider-azurerm/lib/user-assigned-identity";
import { RoleAssignment } from "@cdktf/provider-azurerm/lib/role-assignment";
import { CosmosdbMongoDatabase } from "@cdktf/provider-azurerm/lib/cosmosdb-mongo-database";
import { CosmosdbMongoCollection } from "@cdktf/provider-azurerm/lib/cosmosdb-mongo-collection";
import { CosmosdbAccount } from "@cdktf/provider-azurerm/lib/cosmosdb-account";

export class WeatherResourceStack extends ServiceStack {
    userIdentity: UserAssignedIdentity;

    constructor(scope: Construct, env: Environment) {
        super(scope, "weather-resource", env);

        this.userIdentity = new UserAssignedIdentity(this, "user-identity", {
            location: this.region,
            name: WeatherResourceStack.getUniqueName("weather-user-identity", env),
            resourceGroupName: this.resourceGroup.name,
        })

        new RoleAssignment(this, "role", {
            principalId: this.userIdentity.principalId,
            scope: `/subscriptions/${this.subscription}/resourceGroups/${this.resourceGroup.name}`,
            roleDefinitionName: ""
        })

        const account = new CosmosdbAccount(this, "database-account", {
            location: this.region,
            resourceGroupName: this.resourceGroup.name,
            name: WeatherResourceStack.getUniqueName("weather-database-account", env),
            offerType: "Standard",
            geoLocation: [
                { failoverPriority: 0, location: "westeurope" },
                { failoverPriority: 1, location: "eastus" }
            ],
            consistencyPolicy: {
                consistencyLevel: "BoundedStaleness",
                maxIntervalInSeconds: 300,
                maxStalenessPrefix: 100000
            },
            kind: "MongoDB",
            enableAutomaticFailover: true,
            timeouts: {
                create: "30m",
                update: "30m",
                delete: "30m",
            }
        })

        const database = new CosmosdbMongoDatabase(this, "database", {
            accountName: account.name,
            name: WeatherResourceStack.getUniqueName("weather-database", env),
            resourceGroupName: this.resourceGroup.name,
            throughput: 400
        })

        new CosmosdbMongoCollection(this, "collection", {
            accountName: account.name,
            databaseName: database.name,
            name: WeatherResourceStack.getUniqueName("weather-collection", env),
            resourceGroupName: this.resourceGroup.name,
            throughput: 400,
        })
    }
}

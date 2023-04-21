import { Construct } from "constructs";
import { Environment } from "./Environment";
import { Stack } from "./Stack";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";

export class ServiceStack extends Stack {    
    resourceGroup: ResourceGroup

    constructor(scope: Construct, serviceName: string, env: Environment) {
        super(scope, serviceName, env);

        this.resourceGroup = new ResourceGroup(this, "resource-group", {
            location: this.region,
            name: Stack.getUniqueName(serviceName, env),
            tags: {
                "project": "cdktf4cjo",
                "env": env.name,
                "service": serviceName
            }
        });
    }
}

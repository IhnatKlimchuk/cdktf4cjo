import { Construct } from "constructs";
import { Environment } from "./Environment";
import { Stack } from "./Stack";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";

export class ServiceStack extends Stack {
    resourceGroup: ResourceGroup;
    
    constructor(scope: Construct, serviceName: string, env: Environment) {
        super(scope, ServiceStack.getId(serviceName, env), env);
        this.resourceGroup = new ResourceGroup(this, "resource-group", {
            location: this.region,
            name: ServiceStack.getId(serviceName, env)
        });
    }

    private static getId(serviceName: string, env: Environment) : string {
        // TODO: add service name restriction
        // "/^[a-z]+$/i.test(str);" or custom type should be added
        // can be covered with tests
        // neither arm nor bicep can do that =)

        const id = `${env.name}_${serviceName}_${env.region}`

        // assume "public" as default and omit to avoid any confusion on meaning, but have to add others as suffix
        if(env.cloudEnvironment && env.cloudEnvironment != "public") {
            return `${id}_${env.cloudEnvironment}`
        }

        return id
    }
}

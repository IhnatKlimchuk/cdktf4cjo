import { Construct } from "constructs";
import { ServiceStack } from "../../common/ServiceStack";
import { Environment } from "../../common/Environment";
import { LinuxWebApp } from "@cdktf/provider-azurerm/lib/linux-web-app";
import { ServicePlan } from "@cdktf/provider-azurerm/lib/service-plan";
import { Stack } from "../../common/Stack";
import { ServiceMessagingHub } from "../../constructs/ServiceMessagingHub";

export interface WeatherApiStackProps {
    identityIds?: string[]
}

export class WeatherApiStack extends ServiceStack {
    constructor(scope: Construct, env: Environment, props: WeatherApiStackProps) {
        super(scope, "weather-api", env);

        const { identityIds } = props;

        const plan = new ServicePlan(this, "app-service-plan", {
            location: this.region,
            resourceGroupName: this.resourceGroup.name,
            name: "weather-api-plan",
            osType: "Linux",
            skuName: "B1"
        })

        new LinuxWebApp(this, "app-service", {
            location: this.region,
            resourceGroupName: this.resourceGroup.name,
            name: Stack.getUniqueName("api", env),
            servicePlanId: plan.id,
            siteConfig: {},
            identity: {
                type: "UserAssigned",
                identityIds: identityIds
            }
        })

        new ServiceMessagingHub(this, "weather", {
            env: env,
            resourceGroup: this.resourceGroup,
            hubs: ["test"]
        })
    }
}

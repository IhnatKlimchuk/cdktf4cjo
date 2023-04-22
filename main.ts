import { App } from "cdktf";
import { Environment, Subscription } from "./src/common/Environment";
import { WeatherResourceStack } from "./src/services/Weather/WeatherResourceStack";
import { InfraPipelineStack } from "./src/services/InfraPipeline/InfraPipelineStack";
import { WeatherApiStack } from "./src/services/Weather/WeatherApiStack";

const app = new App();

const devWestEurope: Environment = { name: "dev", region: "westeurope", subscription: Subscription.VisualStudioEnterprise }
const prodEastUs: Environment = { name: "prod", region: "eastus", subscription: Subscription.VisualStudioEnterprise }
const prodWestEurope: Environment = { name: "prod", region: "westeurope", subscription: Subscription.VisualStudioEnterprise }

// Infrastructure 
new InfraPipelineStack(app, prodWestEurope);


{
    // Weather service
    {
        // dev
        const { userIdentity } = new WeatherResourceStack(app, devWestEurope);
        new WeatherApiStack(app, devWestEurope, { 
            identityIds: [userIdentity.id]
        });
    }
    {
        // prod
        const { userIdentity } = new WeatherResourceStack(app, prodWestEurope);

        new WeatherApiStack(app, prodWestEurope, {
            identityIds: [userIdentity.id]
        });
        new WeatherApiStack(app, prodEastUs, {
            identityIds: [userIdentity.id]
        });
    }
}

app.synth();

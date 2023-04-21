import { App } from "cdktf";
import { Environment, Subscription } from "./src/common/Environment";
//import { WeatherResourceStack } from "./src/services/WeatherResourceStack";
import { InfraPipelineStack } from "./src/services/InfraPipeline/InfraPipelineStack";

const app = new App();

//const devWestEurope: Environment = { name: "dev", region: "westeurope", subscription: Subscription.VisualStudioEnterprise }
// const prodEastUs: Environment = { name: "prod", region: "eastus", subscription: Subscription.VisualStudioEnterprise }
const prodWestEurope: Environment = { name: "prod", region: "westeurope", subscription: Subscription.VisualStudioEnterprise }

//new WeatherResourceStack(app, devWestEurope);
//new WeatherResourceStack(app, prodWestEurope);
// new WeatherServiceStack(app, devWestEurope);
// new WeatherServiceStack(app, prodEastUs);
// new WeatherServiceStack(app, prodWestEurope);

new InfraPipelineStack(app, prodWestEurope);
app.synth();

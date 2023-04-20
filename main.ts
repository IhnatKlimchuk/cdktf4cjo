import { App } from "cdktf";
import { WeatherServiceStack } from "./src/services/WeatherServiceStack";
import { Environment, Subscription } from "./src/common/Environment";

const app = new App();

const devWestEurope: Environment = { name: "dev", region: "westeurope", subscription: Subscription.VisualStudioEnterprise }
const prodEastUs: Environment = { name: "prod", region: "eastus", subscription: Subscription.VisualStudioEnterprise }
const prodWestEurope: Environment = { name: "prod", region: "westeurope", subscription: Subscription.VisualStudioEnterprise }

new WeatherServiceStack(app, devWestEurope);
new WeatherServiceStack(app, prodEastUs);
new WeatherServiceStack(app, prodWestEurope);
app.synth();

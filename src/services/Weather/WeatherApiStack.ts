import { Construct } from "constructs";
import { ServiceStack } from "../../common/ServiceStack";
import { Environment } from "../../common/Environment";

export class WeatherServiceStack extends ServiceStack {
    constructor(scope: Construct, env: Environment) {
        super(scope, "weather-api", env);
    }
}

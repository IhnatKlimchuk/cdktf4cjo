import { Construct } from "constructs";
import { Environment } from "./Environment";
import { Stack } from "./Stack";

export class ServiceStack extends Stack {    
    constructor(scope: Construct, serviceName: string, env: Environment) {
        super(scope, serviceName, env);
    }
}

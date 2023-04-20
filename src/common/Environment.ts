export type Region = "westeurope" | "eastus"

export type EnvironmentName = "prod" | "tip" | "dev"

export type CloudEnvironment = "public" | "usgovernment" | "china"

export enum Subscription {
    VisualStudioEnterprise = "27b44136-3d8d-4c3e-b518-b4a1596aaa52",
    PayAsYouGo = "83c42566-f2a4-417a-b19e-1b989c49177b",
}

export interface Environment {
    name: EnvironmentName,
    region: Region,
    subscription: Subscription,
    cloudEnvironment?: CloudEnvironment,
}
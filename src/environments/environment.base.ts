import { AppVersion } from './app-version';
export type BackendType = "nginx"|"trapeze";
export interface IEnvironmentBase {
    readonly apiEndpoint: string;
    readonly backendType:BackendType;
    readonly production: boolean;
    readonly pwa?: boolean;
    readonly version: AppVersion;
}

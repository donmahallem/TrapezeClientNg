import { getAppVersion } from './app-version';
import { IEnvironmentBase } from './environment.base';

export const environment: IEnvironmentBase = {
    apiEndpoint: '/',
    backendType:"trapeze",
    production: true,
    pwa: true,
    version: getAppVersion(),
};

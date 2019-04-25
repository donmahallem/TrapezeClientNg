import { IEnvironmentBase } from './environment.base';
import { getVersion } from './version';

export const environment: IEnvironmentBase = {
    apiEndpoint: '/',
    production: true,
    pwa: false,
    version: getVersion(),
};

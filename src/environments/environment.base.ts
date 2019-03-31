import { URL } from 'url';

export interface IEnvironmentBase {
    production: boolean;
    api: {
        /**
         * url to the config to be requested
         */
        config: string | URL,
    } | {
        /**
         * api endpoint to request
         */
        endpoint: string | URL,
    };
}

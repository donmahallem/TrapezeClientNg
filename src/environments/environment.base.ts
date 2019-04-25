
export interface IEnvironmentBase {
    apiEndpoint: string;
    production: boolean;
    pwa?: boolean;
    readonly version: string;
}

export const createEnvironment = (production: boolean, apiEndpoint: string, pwa?: boolean): IEnvironmentBase => {
    return {
        apiEndpoint,
        production,
        pwa,
        version: require('../../package.json').version,
    };
};

/**
 * Reads the angular app version from the package file
 * @returns The current app version
 */
export const getAppVersion: () => AppVersion = (): AppVersion => {
    return require('../../package.json').version;
};

/**
 * @ignore
 */
enum AppVersionEnum { }
/**
 * App Version
 */
export type AppVersion = AppVersionEnum & string;

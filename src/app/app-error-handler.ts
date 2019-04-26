import { ErrorHandler, Injectable } from '@angular/core';

/**
 * AppErrorHandler to catch global errors
 */
@Injectable()
export class AppErrorHandler implements ErrorHandler {
    /**
     * Handles all errors
     */
    public handleError(error: Error): void {
        // Do whatever you like with the error (send it to the server?)
        // And log it to the console
        // tslint:disable-next-line:no-console
        console.error('It happens: ', error);
    }
}

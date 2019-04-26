import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { AppNotificationService, AppNotificationType } from './services/app-notification.service';

/**
 * AppErrorHandler to catch global errors
 */
@Injectable()
export class AppErrorHandler implements ErrorHandler {

    public constructor(private injector: Injector) { }

    /**
     * If the browser supports the online tag it will
     * returns its value. otherwise it will always be true
     * @returns true if the navigator is offline
     */
    public isClientOffline(): boolean {
        return (navigator.onLine === false);
    }

    /**
     * Handles all errors
     */
    public handleError(error: Error | HttpErrorResponse | any): void {
        // The notification service
        const notificationService: AppNotificationService = this.injector.get(AppNotificationService);
        if (error instanceof HttpErrorResponse) {
            // Server or connection error happened
            if (this.isClientOffline()) {
                // Handle offline error
                return notificationService.notify({
                    title: 'No Internet Connection',
                    type: AppNotificationType.ERROR,
                });
            } else if (error.status) {
                if (error.status >= 500 && error.status < 600) {
                    return notificationService.notify({
                        message: `${error.status} - ${error.message}`,
                        title: 'Server-Error',
                        type: AppNotificationType.ERROR,
                    });
                } else if (error.status >= 400 && error.status < 500) {
                    return notificationService.notify({
                        message: `${error.status} - ${error.message}`,
                        title: 'Request-Error',
                        type: AppNotificationType.ERROR,
                    });
                }
            }
            return notificationService.notify({
                title: 'Unknown HTTP-Error occured',
                type: AppNotificationType.ERROR,
            });

        } else {
            // Handle Client Error (Angular Error, ReferenceError...)
        }
        // tslint:disable-next-line:no-console
        console.error('It happens: ', error);
    }
}

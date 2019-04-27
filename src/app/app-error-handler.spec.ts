import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppErrorHandler } from './app-error-handler';
import { AppNotificationService, AppNotificationType } from './services/app-notification.service';

describe('src/app/app-error-handler.ts', () => {
    describe('AppErrorHandler', () => {
        let handler: AppErrorHandler;
        const notifySpy: jasmine.Spy<InferableFunction> = jasmine.createSpy('notifySpy');
        let isClientOfflineSpy: jasmine.Spy<InferableFunction>;
        let notificationService: AppNotificationService;
        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [{
                    provide: AppNotificationService,
                    useValue: {
                        notify: notifySpy,
                    },
                }, {
                    provide: ErrorHandler,
                    useClass: AppErrorHandler,
                }],
            });
            handler = TestBed.get(ErrorHandler);
            notificationService = TestBed.get(AppNotificationService);
            isClientOfflineSpy = spyOn(handler, 'isClientOffline');
        });
        afterEach(() => {
            isClientOfflineSpy.calls.reset();
            notifySpy.calls.reset();
        });
        it('should be constructed', () => {
            expect(handler).toBeTruthy();
        });
        describe('handleError()', () => {
            let handleHttpErrorResponseSpy: jasmine.Spy<InferableFunction>;
            beforeEach(() => {
                handleHttpErrorResponseSpy = spyOn(handler, 'handleHttpErrorResponse');
                handleHttpErrorResponseSpy.and.callFake(() => {
                    return false;
                });
            });
            afterEach(() => {
                handleHttpErrorResponseSpy.calls.reset();
            });
            describe('an HttpErrorResponse is reported', () => {
                [new HttpErrorResponse({
                    status: 200,
                    statusText: '500 error message',
                })].forEach((testError: any) => {
                    it('should call handleHttpErrorResponse()', () => {
                        handler.handleError(testError);
                        expect(handleHttpErrorResponseSpy).toHaveBeenCalledTimes(1);
                        expect(handleHttpErrorResponseSpy).toHaveBeenCalledWith(testError, notificationService);
                        expect(notifySpy).toHaveBeenCalledTimes(0);
                    });
                });
            });
        });
        describe('handleHttpErrorResponse(err,notificationService)', () => {
            const createError = (code: number) => {
                return new HttpErrorResponse({
                    status: code,
                    statusText: 'Status ' + code,
                    url: 'http://test.com/' + code,
                });
            };
            const testHttpErrors: {
                error: HttpErrorResponse,
                message: {
                    type?: AppNotificationType;
                    title: string;
                    message?: string;
                    reportable?: boolean;
                },
            }[] = [{
                error: createError(404),
                message: {
                    message: `404 - ${createError(404).message}`,
                    title: 'Request-Error',
                    type: AppNotificationType.ERROR,
                },
            }, {
                error: createError(520),
                message: {
                    message: `520 - ${createError(520).message}`,
                    title: 'Server-Error',
                    type: AppNotificationType.ERROR,
                },
            }, {
                error: createError(350),
                message: {
                    title: 'Unknown HTTP-Error occured',
                    type: AppNotificationType.ERROR,
                },
            }];
            describe('client is offline', () => {
                beforeEach(() => {
                    isClientOfflineSpy.and.returnValue(true);
                });
                testHttpErrors.forEach((testError) => {
                    it('should notify that the client is offline for status: ' + testError.error.status, () => {
                        handler.handleHttpErrorResponse(testError.error, notificationService);
                        expect(isClientOfflineSpy).toHaveBeenCalledTimes(1);
                        expect(notifySpy).toHaveBeenCalledTimes(1);
                        expect(notifySpy).toHaveBeenCalledWith({
                            title: 'No Internet Connection',
                            type: AppNotificationType.ERROR,
                        });
                    });
                });
            });
            describe('client is online', () => {
                beforeEach(() => {
                    isClientOfflineSpy.and.callFake(() => false);
                });
                testHttpErrors.forEach((testError) => {
                    it('should propagate a server error for code: ' + testError.error.status, () => {
                        handler.handleHttpErrorResponse(testError.error, notificationService);
                        expect(isClientOfflineSpy).toHaveBeenCalledTimes(1);
                        expect(notifySpy).toHaveBeenCalledTimes(1);
                        expect(notifySpy).toHaveBeenCalledWith(testError.message);
                    });
                });
            });
        });
    });
});

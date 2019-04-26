import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppErrorHandler } from './app-error-handler';
import { AppNotificationService, AppNotificationType } from './services/app-notification.service';

describe('src/app/app-error-handler.ts', () => {
    describe('AppErrorHandler', () => {
        let handler: AppErrorHandler;
        const notifySpy: jasmine.Spy<InferableFunction> = jasmine.createSpy();
        let isClientOfflineSpy: jasmine.Spy<InferableFunction>;
        beforeAll(() => {
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
            describe('client is offnline', () => {
                const notifyReturnValue = 'any value';
                beforeEach(() => {
                    isClientOfflineSpy.and.returnValue(true);
                    notifySpy.and.returnValue(notifyReturnValue);
                });
                it('should abort early if the client is offline', () => {
                    expect(handler.handleError(undefined)).toEqual(notifyReturnValue);
                    expect(notifySpy).toHaveBeenCalledTimes(1);
                    expect(notifySpy).toHaveBeenCalledWith([{
                        title: 'No Internet Connection',
                        type: AppNotificationType.ERROR,
                    }]);
                });
            });
            describe('client is online', () => {
                beforeEach(() => {
                    isClientOfflineSpy.and.returnValue(false);
                });
                describe('HttpErrorResponse was provided', () => {
                    [500, 550, 599].forEach((testValue: number): void => {
                        it('should propagate a server error for code: ' + testValue, () => {
                            const err = new HttpErrorResponse({
                                status: testValue,
                                statusText: '500 error message',
                            });
                            handler.handleError(err);
                            expect(notifySpy).toHaveBeenCalledTimes(1);
                            expect(notifySpy).toHaveBeenCalledWith([{
                                message: `${err.status} - ${err.message}`,
                                title: 'Server-Error',
                                type: AppNotificationType.ERROR,
                            }]);
                            expect(isClientOfflineSpy).toHaveBeenCalledTimes(1);
                        });
                    });
                    [400, 450, 499].forEach((testValue: number): void => {
                        it('should propagate a Request error for code: ' + testValue, () => {
                            const err = new HttpErrorResponse({
                                status: testValue,
                                statusText: '400 error message',
                            });
                            handler.handleError(err);
                            expect(notifySpy).toHaveBeenCalledTimes(1);
                            expect(notifySpy).toHaveBeenCalledWith([{
                                message: `${err.status} - ${err.message}`,
                                title: 'Request-Error',
                                type: AppNotificationType.ERROR,
                            }]);
                            expect(isClientOfflineSpy).toHaveBeenCalledTimes(1);
                        });
                    });
                });
            });
        });
    });
});

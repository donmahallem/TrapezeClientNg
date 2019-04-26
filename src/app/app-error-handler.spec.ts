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
            isClientOfflineSpy = spyOn(handler, 'isClientOffline');
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
        });
        afterEach(() => {
            isClientOfflineSpy.calls.reset();
            notifySpy.calls.reset();
        });
        it('should be constructed', () => {
            expect(handler).toBeTruthy();
        });
        describe('handleError()', () => {
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
                });
            });
        });
    });
});

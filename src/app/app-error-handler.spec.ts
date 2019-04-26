import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppErrorHandler } from './app-error-handler';
import { AppNotificationService } from './services/app-notification.service';

describe('src/app/app-error-handler.ts', () => {
    describe('AppErrorHandler', () => {
        let handler: AppErrorHandler;
        const injectorSpy: jasmine.Spy<InferableFunction> = jasmine.createSpy();
        const notifySpy: jasmine.Spy<InferableFunction> = jasmine.createSpy();
        beforeAll(() => {
            handler = new AppErrorHandler({
                get: injectorSpy,
            });

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
        it('should be constructed', () => {
            expect(handler).toBeTruthy();
        });
        describe('handleError()', () => {
            it('needs to be implemented');
        });
        afterEach(() => {
            injectorSpy.calls.reset();
            notifySpy.calls.reset();
        });
    });
});

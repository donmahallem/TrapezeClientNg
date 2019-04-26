import { from } from 'rxjs';
import { retryWhen } from 'rxjs/operators';
import { retryDialogStrategy, RetryDialogStrategyFuncResponse } from './retry-dialog-strategy';

describe('src/app/rxjs-util/retry-dialog-strategy.ts', () => {
    describe('retryDialogStrategy', () => {
        let createDialogSpy: jasmine.Spy<InferableFunction>;
        let strategy: RetryDialogStrategyFuncResponse;
        let nextSpy: jasmine.Spy<InferableFunction>;
        let errorSpy: jasmine.Spy<InferableFunction>;
        beforeAll(() => {
            createDialogSpy = jasmine.createSpy();
            nextSpy = jasmine.createSpy('nextSpy');
            errorSpy = jasmine.createSpy('errorSpy');
        });
        beforeEach(() => {
            strategy = retryDialogStrategy(createDialogSpy);
        });
        afterEach(() => {
            createDialogSpy.calls.reset();
            nextSpy.calls.reset();
            errorSpy.calls.reset();
        });
        describe('No error occures', () => {
            it('should pass', (done) => {
                from([1, 2, 3])
                    .pipe(retryWhen(strategy))
                    .subscribe(nextSpy, errorSpy, () => {
                        expect(errorSpy).not.toHaveBeenCalled();
                        expect(nextSpy).toHaveBeenCalledTimes(3);
                        expect(nextSpy.calls.allArgs()).toEqual([[1], [2], [3]]); // , [2], [3]);
                        expect(createDialogSpy).not.toHaveBeenCalled();
                        done();
                    });
            });
            afterEach(() => {
                expect(createDialogSpy).not.toHaveBeenCalled();
            });
        });
        describe('Error occurs', () => {
            describe('Should be retried', () => {
                it('needs to be implemented');
            });
            describe('Should not be retried', () => {
                it('needs to be implemented');
            });
        });
    });
});

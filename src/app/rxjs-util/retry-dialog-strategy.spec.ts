import { retryDialogStrategy, RetryDialogStrategyFuncResponse } from './retry-dialog-strategy';

describe('src/app/rxjs-util/retry-dialog-strategy.ts', () => {
    describe('retryDialogStrategy', () => {
        let createDialogSpy: jasmine.Spy<InferableFunction>;
        let strategy: RetryDialogStrategyFuncResponse;
        beforeAll(() => {
            createDialogSpy = jasmine.createSpy();
        });
        beforeEach(() => {
            strategy = retryDialogStrategy(createDialogSpy);
        });
        afterEach(() => {
            createDialogSpy.calls.reset();
        });
        it('needs to be implemented');
    });
});

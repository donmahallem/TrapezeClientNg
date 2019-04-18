import { async, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError, Observable } from 'rxjs';
import { ApiService } from 'src/app/services';
import { StopInfoResolver } from './stop-info.resolver';
// import * as sinon from "sinon";

describe('src/app/modules/stop/stop-info.resolver', () => {
    describe('StopInfoResolver', () => {
        let resolver: StopInfoResolver;
        let getSpy: jasmine.Spy<InferableFunction>;
        let nextSpy: jasmine.Spy<InferableFunction>;
        let navigateSpy: jasmine.Spy<InferableFunction>;
        const testId = '239jmcntest';
        beforeAll(() => {
            getSpy = jasmine.createSpy();
            navigateSpy = jasmine.createSpy();
            nextSpy = jasmine.createSpy();
        });
        beforeEach(async(() => {
            TestBed.configureTestingModule({
                providers: [StopInfoResolver,
                    {
                        provide: ApiService,
                        useValue: {
                            getStopPassages: getSpy,
                        },
                    }, {
                        provide: Router,
                        useValue: {
                            navigate: navigateSpy,
                        },
                    }],
            });
            resolver = TestBed.get(StopInfoResolver);
        }));

        afterEach(() => {
            getSpy.calls.reset();
            nextSpy.calls.reset();
            navigateSpy.calls.reset();
        });

        describe('resolve(route, state)', () => {
            describe('should succeed', () => {
                beforeEach(() => {
                    getSpy.and.callFake((...args: any[]): Observable<any> => {
                        return of(args);
                    });
                });
                it('should construct the request correctly', (done) => {
                    resolver.resolve(<any>{ params: { stopId: testId } }, undefined).subscribe(nextSpy, done, done);
                });
                afterEach(() => {
                    expect(nextSpy.calls.count()).toEqual(1);
                    expect(<any>nextSpy.calls.first().args[0])
                        .toEqual([testId]);
                    expect(navigateSpy.calls.count()).toEqual(0);
                });
            });
            describe('should not navigate for generic error', () => {
                const testError: Error = new Error('test error');
                beforeEach(() => {
                    getSpy.and.callFake((...args: any[]): Observable<any> => {
                        return throwError(testError);
                    });
                });
                it('should construct the request correctly', (done) => {
                    resolver.resolve(<any>{ params: { tripId: testId } }, undefined).subscribe(nextSpy, done, done);
                });
                afterEach(() => {
                    expect(nextSpy.calls.count()).toEqual(0);
                    expect(navigateSpy.calls.count()).toEqual(0);
                });
            });
            describe('should navigate for 404 error', () => {
                const testError: any = {
                    status: 404,
                };
                beforeEach(() => {
                    getSpy.and.callFake((...args: any[]): Observable<any> => {
                        return throwError(testError);
                    });
                });
                it('should construct the request correctly', (done) => {
                    resolver.resolve(<any>{ params: { tripId: testId } }, undefined).subscribe(nextSpy, done, done);
                });
                afterEach(() => {
                    expect(nextSpy.calls.count()).toEqual(0);
                    expect(navigateSpy.calls.count()).toEqual(1);
                });
            });
        });
    });
});

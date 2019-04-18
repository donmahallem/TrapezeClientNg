import { async, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError, EMPTY, Observable } from 'rxjs';
import { ApiService } from 'src/app/services';
import { StopInfoResolver } from './stop-info.resolver';
// import * as sinon from "sinon";

describe('src/app/modules/stop/stop-info.resolver', () => {
    describe('StopInfoResolver', () => {
        let resolver: StopInfoResolver;
        let getSpy: jasmine.Spy<InferableFunction>;
        let navigateSpy: jasmine.Spy<InferableFunction>;
        const testId = '239jmcntest';
        beforeAll(() => {
            getSpy = jasmine.createSpy();
            navigateSpy = jasmine.createSpy();
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
        });

        describe('resolve(route, state)', () => {
            describe('should succeed', () => {
                beforeAll(() => {
                    getSpy.and.callFake((...args: any[]): Observable<any> => {
                        return of(args);
                    });
                });
                it('should construct the request correctly', (done) => {
                    resolver.resolve(<any>{ params: { stopId: testId } }, undefined).subscribe((res) => {
                        expect(<any>res)
                            .toEqual([<any>testId]);
                    }, done, done);
                });
            });
            describe('should not navigate for generic error', () => {
                const testError: Error = new Error('test error');
                beforeAll(() => {
                    getSpy.and.callFake((...args: any[]): Observable<any> => {
                        return throwError(testError);
                    });
                });
                it('should construct the request correctly', (done) => {
                    resolver.resolve(<any>{ params: { stopId: testId } }, undefined).subscribe((res) => {
                        expect(<any>res)
                            .toEqual([EMPTY]);
                        expect(navigateSpy.calls.count).toEqual(0);
                    }, done, done);
                });
            });
            describe('should navigate for generic error', () => {
                const testError: any = {
                    status: 404,
                };
                beforeAll(() => {
                    getSpy.and.callFake((...args: any[]): Observable<any> => {
                        return throwError(testError);
                    });
                });
                it('should construct the request correctly', (done) => {
                    resolver.resolve(<any>{ params: { stopId: testId } }, undefined).subscribe((res) => {
                        expect(<any>res)
                            .toEqual([EMPTY]);
                        expect(navigateSpy.calls.count).toEqual(1);
                    }, done, done);
                });
            });
        });
    });
});

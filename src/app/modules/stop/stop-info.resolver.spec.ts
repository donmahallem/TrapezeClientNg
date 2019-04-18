import { async, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, Observable } from 'rxjs';
import { ApiService } from 'src/app/services';
import { StopInfoResolver } from './stop-info.resolver';
// import * as sinon from "sinon";

describe('src/app/modules/stop/stop-info.resolver', () => {
    describe('StopInfoResolver', () => {
        let resolver: StopInfoResolver;
        let getSpy: jasmine.Spy<InferableFunction>;
        const testId = '239jmcntest';
        beforeAll(() => {
            getSpy = jasmine.createSpy();
        });
        beforeEach(async(() => {
            getSpy.and.callFake((...args: any[]): Observable<any> => {
                return of(args);
            });
            TestBed.configureTestingModule({
                providers: [StopInfoResolver,
                    {
                        provide: ApiService,
                        useValue: {
                            getStopPassages: getSpy,
                        },
                    }, {
                        provide: Router,
                        useValue: {},
                    }],
            });
            resolver = TestBed.get(StopInfoResolver);
        }));

        afterEach(() => {
            getSpy.calls.reset();
        });

        describe('resolve(route, state)', () => {
            it('should construct the request correctly', (done) => {
                resolver.resolve(<any>{ params: { stopId: testId } }, undefined).subscribe((res) => {
                    expect(<any>res)
                        .toEqual([<any>testId]);
                }, done, done);
            });
        });
    });
});

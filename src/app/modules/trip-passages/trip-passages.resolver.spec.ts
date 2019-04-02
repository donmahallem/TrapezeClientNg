import { async, TestBed } from '@angular/core/testing';
import { of, Observable } from 'rxjs';
import { ApiService } from 'src/app/services';
import { TripPassagesResolver } from './trip-passages.resolver';
// import * as sinon from "sinon";
describe('src/app/modules/stop/trip-passages.resolver', () => {
    describe('TripPassagesResolver', () => {
        let resolver: TripPassagesResolver;
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
                providers: [TripPassagesResolver,
                    {
                        provide: ApiService,
                        useValue: {
                            getTripPassages: getSpy,
                        },
                    }],
            });
            resolver = TestBed.get(TripPassagesResolver);
        }));

        afterEach(() => {
            getSpy.calls.reset();
        });

        describe('resolve(route, state)', () => {
            it('should construct the request correctly', (done) => {
                resolver.resolve(<any>{ params: { tripId: testId } }, undefined).subscribe((res) => {
                    expect(res)
                        .toEqual([testId]);
                }, done, done);
            });
        });
    });
});

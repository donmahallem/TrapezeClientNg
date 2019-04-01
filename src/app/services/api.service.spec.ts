import { HttpClient } from '@angular/common/http';
import { async, TestBed } from '@angular/core/testing';
import { of, Observable } from 'rxjs';
import { ApiService } from './api.service';
// import * as sinon from "sinon";
describe('src/app/services/api.service', () => {
    describe('ApiService', () => {
        let apiService: ApiService;
        let getSpy: jasmine.Spy<InferableFunction>;
        const testEndpoint = 'https://test.com/';
        beforeAll(() => {
            getSpy = jasmine.createSpy();
        });
        beforeEach(async(() => {
            getSpy.and.callFake((...args: any[]): Observable<any> => {
                return of(args);
            });
            TestBed.configureTestingModule({
                providers: [ApiService,
                    {
                        provide: HttpClient,
                        useValue: {
                            get: getSpy,
                        },
                    }],
            });
            apiService = TestBed.get(ApiService);
            spyOn(apiService, 'baseUrl').and.returnValue(testEndpoint);
        }));

        afterEach(() => {
            getSpy.calls.reset();
        });

        describe('getTripPassages(tripId)', () => {
            it('should construct the request correctly', (done) => {
                const testId = 'testId1234';
                apiService.getTripPassages(testId).subscribe((res) => {
                    expect(res)
                        .toEqual([testEndpoint + 'api/trip/testId1234/passages?mode=departure']);
                }, done, done);
            });
        });
        describe('getRouteByVehicleId(vehicleId)', () => {
            it('should construct the request correctly', (done) => {
                const testId = 'testId1234';
                apiService.getTripPassages(testId).subscribe((res) => {
                    expect(res)
                        .toEqual([testEndpoint + 'api/vehicle/testId1234/route']);
                }, done, done);
            });
        });
    });
});

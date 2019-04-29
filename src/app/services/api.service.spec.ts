import { HttpClient } from '@angular/common/http';
import { async, TestBed } from '@angular/core/testing';
import { from, Observable } from 'rxjs';
import { ApiService } from './api.service';
// import * as sinon from "sinon";
describe('src/app/services/api.service', () => {
    describe('ApiService', () => {
        let apiService: ApiService;
        let getSpy: jasmine.Spy<InferableFunction>;
        const testEndpoint = 'https://test.com/';
        const testId: any = 'testId1234';
        beforeAll(() => {
            getSpy = jasmine.createSpy();
        });
        beforeEach(async(() => {
            getSpy.and.callFake((...args: any[]): Observable<any> => {
                return from([args]);
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
                apiService.getTripPassages(testId).subscribe((res) => {
                    expect(<any>res)
                        .toEqual([testEndpoint + 'api/trip/' + testId + '/passages?mode=departure']);
                }, done, done);
            });
        });
        describe('getRouteByVehicleId(vehicleId)', () => {
            it('should construct the request correctly', (done) => {
                apiService.getRouteByVehicleId(testId).subscribe((res) => {
                    expect(res)
                        .toEqual([testEndpoint + 'api/vehicle/' + testId + '/route']);
                }, done, done);
            });
        });
        describe('getRouteByTripId(vehicleId)', () => {
            it('should construct the request correctly', (done) => {
                apiService.getRouteByTripId(testId).subscribe((res) => {
                    expect(res)
                        .toEqual([testEndpoint + 'api/trip/' + testId + '/route']);
                }, done, done);
            });
        });
        describe('getStopInfo(vehicleId)', () => {
            it('should construct the request correctly', (done) => {
                apiService.getStopInfo(testId).subscribe((res) => {
                    expect(<any>res)
                        .toEqual([testEndpoint + 'api/stop/' + testId + '/info']);
                }, done, done);
            });
        });
        describe('getStopDepartures(vehicleId)', () => {
            it('should construct the request correctly', (done) => {
                apiService.getStopPassages(testId).subscribe((res) => {
                    expect(<any>res)
                        .toEqual([testEndpoint + 'api/stop/' + testId + '/departures']);
                }, done, done);
            });
        });
        describe('getVehicleLocation(vehicleId)', () => {
            it('should construct the request correctly', (done) => {
                apiService.getVehicleLocation(testId).subscribe((res) => {
                    expect(<any>res)
                        .toEqual([<any>testEndpoint + 'api/geo/vehicle/testId1234']);
                }, done, done);
            });
        });
        describe('getStations()', () => {
            it('should construct the request correctly', (done) => {
                apiService.getStations().subscribe((res) => {
                    expect(res)
                        .toEqual(<any>[testEndpoint + 'api/geo/stops']);
                }, done, done);
            });
        });
    });
});

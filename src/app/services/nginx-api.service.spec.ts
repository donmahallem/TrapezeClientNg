import { HttpClient } from '@angular/common/http';
import { async, TestBed } from '@angular/core/testing';
import { IStopInfo, IStopLocations, IStopPointLocations, ITripPassages, IVehiclePathInfo } from '@donmahallem/trapeze-api-types';
import { from, Observable } from 'rxjs';
import { NginxApiService } from './nginx-api.service';
// import * as sinon from "sinon";
describe('src/app/services/api.service', () => {
    describe('ApiService', () => {
        let apiService: NginxApiService;
        let getSpy: jasmine.Spy<jasmine.Func>;
        const testEndpoint = 'https://test.com/';
        const testId: any = 'testId1234';
        beforeAll(() => {
            getSpy = jasmine.createSpy();
        });
        beforeEach(async(() => {
            getSpy.and.callFake((...args: any[]): Observable<any> =>
                from([args]));
            TestBed.configureTestingModule({
                providers: [NginxApiService,
                    {
                        provide: HttpClient,
                        useValue: {
                            get: getSpy,
                        },
                    }],
            });
            apiService = TestBed.get(NginxApiService);
            spyOn(apiService, 'baseUrl').and.returnValue(testEndpoint);
        }));

        afterEach(() => {
            getSpy.calls.reset();
        });

        describe('getTripPassages(tripId)', () => {
            it('should construct the request correctly', (done) => {
                apiService.getTripPassages(testId).subscribe((res: ITripPassages) => {
                    expect(res as any)
                        .toEqual([testEndpoint + 'trip/' + testId + '/passages?mode=departure']);
                }, done, done);
            });
        });
        describe('getRouteByVehicleId(vehicleId)', () => {
            it('should construct the request correctly', (done) => {
                apiService.getRouteByVehicleId(testId).subscribe((res: IVehiclePathInfo) => {
                    expect(res)
                        .toEqual([testEndpoint + 'vehicle/' + testId + '/route'] as any);
                }, done, done);
            });
        });
        describe('getRouteByTripId(vehicleId)', () => {
            it('should construct the request correctly', (done) => {
                apiService.getRouteByTripId(testId).subscribe((res: IVehiclePathInfo) => {
                    expect(res)
                        .toEqual([testEndpoint + 'trip/' + testId + '/route'] as any);
                }, done, done);
            });
        });
        describe('getStopInfo(vehicleId)', () => {
            it('should construct the request correctly', (done) => {
                apiService.getStopInfo(testId).subscribe((res: IStopInfo) => {
                    expect(res as any)
                        .toEqual([testEndpoint + 'stop/' + testId + '/info']);
                }, done, done);
            });
        });
        describe('getStopDepartures(vehicleId)', () => {
            it('should construct the request correctly', (done) => {
                apiService.getStopPassages(testId).subscribe((res) => {
                    expect(res as any)
                        .toEqual([testEndpoint + 'stop/' + testId + '/passages']);
                }, done, done);
            });
        });
        describe('getStopLocations()', () => {
            it('should construct the request correctly', (done) => {
                apiService.getStopLocations().subscribe((res: IStopLocations) => {
                    expect(res)
                        .toEqual([testEndpoint + 'geo/stops?left=-648000000&bottom=-324000000&right=648000000&top=324000000'] as any);
                }, done, done);
            });
        });
        describe('getStopPointLocations()', () => {
            it('should construct the request correctly', (done) => {
                apiService.getStopPointLocations().subscribe((res: IStopPointLocations) => {
                    expect(res)
                        .toEqual([testEndpoint + 'geo/stopPoints?left=-648000000&bottom=-324000000&right=648000000&top=324000000'] as any);
                }, done, done);
            });
        });
    });
});

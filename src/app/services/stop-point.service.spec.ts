import { async, TestBed } from '@angular/core/testing';
import { IStopLocation } from '@donmahallem/trapeze-api-types';
import { ApiService } from './api.service';
import { StopPointService } from './stop-point.service';

class TestApiService {

}

describe('src/app/services/stop-point.service', () => {
    describe('StopPointService', () => {
        let stopService: StopPointService;
        let nextSpy: jasmine.Spy<InferableFunction>;
        const testLocations: IStopLocation[] = [
            <any>{
                latitude: 1,
                longitude: 2,
                shortName: '1',
            },
            <any>{
                latitude: 2,
                longitude: 2,
                shortName: '2',
            },
            <any>{
                latitude: 3,
                longitude: 45,
                shortName: '3',
            },
        ];
        beforeAll(() => {
            nextSpy = jasmine.createSpy();
        });
        beforeEach(async(() => {
            TestBed.configureTestingModule({
                providers: [StopPointService,
                    {
                        provide: ApiService,
                        useValue: new TestApiService(),
                    }],
            });
            stopService = TestBed.get(StopPointService);
        }));

        afterEach(() => {
            nextSpy.calls.reset();
        });

        describe('loadStops()', () => {
            it('needs to implemented');
        });

        describe('stopLocations', () => {
            describe('getter', () => {
                it('should get an empty list if mStopLocations is set to undefined', () => {
                    (<any>stopService).mStopLocations = undefined;
                    expect(stopService.stopLocations).toEqual([]);
                });
                it('should get an empty list if mStopLocations is a list', () => {
                    (<any>stopService).mStopLocations = testLocations;
                    expect(stopService.stopLocations).toEqual(testLocations);
                });
            });
        });
        describe('getStopLocation(stopShortName)', () => {
            it('should return if the stopShortName is unknown', () => {
                (<any>stopService).mStopLocations = [];
                expect(stopService.getStopLocation('1')).toBeUndefined();
            });
            it('should return the expected item', () => {
                (<any>stopService).mStopLocations = testLocations;
                expect(stopService.getStopLocation('1')).toEqual(testLocations[0]);
                expect(stopService.getStopLocation('3')).toEqual(testLocations[2]);
            });
        });
        describe('isLoading', () => {

            describe('getter', () => {
                it('needs to implemented');
            });

        });
        describe('stopLocationsObservable', () => {

            describe('getter', () => {
                it('needs to implemented');
            });

        });
    });
});

import { async, TestBed } from '@angular/core/testing';
import { IStopLocation } from '@donmahallem/trapeze-api-types';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { StopPointService } from './stop-point.service';

class TestApiService {

}

describe('src/app/services/stop-point.service', () => {
    describe('StopPointService', () => {
        let stopService: StopPointService;
        let nextSpy: jasmine.Spy<InferableFunction>;
        let subject: BehaviorSubject<IStopLocation[]>;
        const initialValue: any[] = ['testdata1', 'testdata2'];
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
            subject = (<any>stopService).stopLocationsSubject;
            subject.next(initialValue);
        }));

        afterEach(() => {
            nextSpy.calls.reset();
        });

        describe('loadStops()', () => {
            it('needs to implemented');
        });

        describe('stopLocations', () => {
            describe('getter', () => {
                it('should get an empty list if undefined is provided', () => {
                    expect(subject.value).toEqual(initialValue);
                    subject.next(testLocations);
                    expect(stopService.stopLocations).toEqual(testLocations);
                });
            });
            describe('setter', () => {
                it('should set an empty list if undefined is provided', () => {
                    expect(subject.value).toEqual(initialValue);
                    stopService.stopLocations = undefined;
                    expect(subject.value).toEqual([]);
                });
                it('should set the list provided', () => {
                    expect(subject.value).toEqual(initialValue);
                    stopService.stopLocations = testLocations;
                    expect(subject.value).toEqual(testLocations);
                });
            });
        });
        describe('getStopLocation(stopShortName)', () => {
            it('should return if the stopShortName is unknown', () => {
                expect(subject.value).toEqual(initialValue);
                subject.next([]);
                expect(stopService.getStopLocation('1')).toBeUndefined();
            });
            it('should return the expected item', () => {
                expect(subject.value).toEqual(initialValue);
                subject.next(testLocations);
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

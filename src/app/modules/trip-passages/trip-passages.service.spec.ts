import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { TripPassagesService } from './trip-passages.service';

describe('src/app/modules/trip-passages/trip-passages.service', () => {
    describe('TripPassagesService', () => {
        beforeAll(() => {
        });

        afterEach(() => {
        });

        describe('constructor()', () => {
            const initialTripData: any = {
                id: 'tripId1',
            };
            const initialRouteData: any = {
                tripPassages: initialTripData,
            };
            const routeDataSubject: Subject<any> = new Subject();
            let createStatusObservableSpy: jasmine.Spy<jasmine.Func>;
            const refreshSubject: Subject<any> = new Subject();
            beforeEach(() => {
                createStatusObservableSpy = spyOn(TripPassagesService.prototype, 'createStatusObservable');
                createStatusObservableSpy.and.returnValue(refreshSubject);
            });
            afterEach(() => {
                createStatusObservableSpy.calls.reset();
            });
            describe('statusSubject should be set by route data', () => {
                it('statusSubject should be initialized with route snapshot data', (doneFn: DoneFn) => {
                    const testRoute: any = {
                        snapshot: { data: initialRouteData },
                        data: routeDataSubject.asObservable(),
                    };
                    const service: TripPassagesService = new TripPassagesService(testRoute, undefined);
                    (service as any).statusSubject
                        .pipe(take(1))
                        .subscribe({
                            next: (val) => {
                                expect(val).toEqual(initialTripData);
                                doneFn();
                            }, error: doneFn,
                            complete: doneFn,
                        });
                });
            });
            describe('statusObservable ', () => {
                it('should set statusObservable to value from createStatusObservable()', (doneFn: DoneFn) => {
                    const testRoute: any = {
                        snapshot: { data: initialRouteData },
                        data: routeDataSubject.asObservable(),
                    };
                    const service: TripPassagesService = new TripPassagesService(testRoute, undefined);
                    service.statusObservable
                        .pipe(take(1))
                        .subscribe({
                            next: (val) => {
                                expect(val).toEqual(initialTripData);
                                doneFn();
                            }, error: doneFn,
                            complete: doneFn,
                        });
                    refreshSubject.next(initialTripData);
                });
            });
        });
    });
});

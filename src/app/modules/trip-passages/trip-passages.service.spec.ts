import { fakeAsync, tick } from '@angular/core/testing';
import { TripId } from '@donmahallem/trapeze-api-types';
import { of, NEVER, Observable, Subject, Subscription } from 'rxjs';
import { delay, take } from 'rxjs/operators';
import { TripPassagesService } from './trip-passages.service';
import { IPassageStatus, UpdateStatus } from './trip-util';

type PartialPassageStatus = Partial<IPassageStatus>;
describe('src/app/modules/trip-passages/trip-passages.service', () => {
    describe('TripPassagesService', () => {
        const initialTripData: any = {
            id: 'tripId1',
        };
        const initialRouteData: any = {
            tripPassages: initialTripData,
        };
        describe('constructor()', () => {
            const routeDataSubject: Subject<any> = new Subject();
            let createStatusObservableSpy: jasmine.Spy<jasmine.Func>;
            const refreshSubject: Subject<any> = new Subject();
            const testRoute: any = {
                snapshot: { data: initialRouteData },
                data: routeDataSubject.asObservable(),
            };
            beforeEach(() => {
                createStatusObservableSpy = spyOn(TripPassagesService.prototype, 'createStatusObservable');
                createStatusObservableSpy.and.returnValue(refreshSubject);
            });
            afterEach(() => {
                createStatusObservableSpy.calls.reset();
            });
            describe('statusSubject should be set by route data', () => {
                it('statusSubject should be initialized with route snapshot data', (doneFn: DoneFn) => {
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
        describe('createRefreshPollObservable', () => {
            const networkResult: any = {
                network: true,
                result: 1,
            };
            let testObservable: Observable<IPassageStatus>;
            const statusSubject: Subject<PartialPassageStatus> = new Subject();
            const getTripPassagesSpy: jasmine.Spy<jasmine.Func> = jasmine.createSpy('getTripPassages');
            let createStatusObservableSpy: jasmine.Spy<jasmine.Func>;
            let testService: TripPassagesService;
            let createDelayedPassageRequestSpy: jasmine.Spy<jasmine.Func>;
            beforeAll(() => {
                createStatusObservableSpy = spyOn(TripPassagesService.prototype, 'createStatusObservable');
                createStatusObservableSpy.and.returnValue(NEVER);
                const testRoute: any = {
                    snapshot: { data: initialRouteData },
                };
                const testApiService: any = {
                    getTripPassages: getTripPassagesSpy,
                };
                testService = new TripPassagesService(testRoute, testApiService);
                createDelayedPassageRequestSpy = spyOn(testService, 'createDelayedPassageRequest');
            });
            beforeEach(() => {
                testObservable = testService.createRefreshPollObservable(statusSubject as Subject<IPassageStatus>);
            });
            afterEach(() => {
                getTripPassagesSpy.calls.reset();
                createStatusObservableSpy.calls.reset();
            });
            it('should delay querying 10s if previous status is LOADED', fakeAsync((done) => {
                getTripPassagesSpy.and.returnValue(of(networkResult));
                const nextSpy: jasmine.Spy<jasmine.Func> = jasmine.createSpy('nextSpy');
                createDelayedPassageRequestSpy.and.callFake(() =>
                    of(createDelayedPassageRequestSpy.calls.count()).pipe(delay(1000)));
                const subscription: Subscription = testObservable.subscribe(nextSpy);
                expect(createDelayedPassageRequestSpy).toHaveBeenCalledTimes(0);
                statusSubject.next({
                    status: UpdateStatus.LOADED,
                    tripId: '1' as TripId,
                });
                expect(createDelayedPassageRequestSpy).toHaveBeenCalledTimes(1);
                expect(nextSpy).toHaveBeenCalledTimes(0);
                tick(1100);
                expect(nextSpy).toHaveBeenCalledTimes(1);
                statusSubject.next({
                    status: UpdateStatus.LOADED,
                    tripId: '2' as TripId,
                });
                expect(createDelayedPassageRequestSpy).toHaveBeenCalledTimes(2);
                tick(500);
                expect(nextSpy).toHaveBeenCalledTimes(1);
                statusSubject.next({
                    status: UpdateStatus.ERROR,
                    tripId: '3' as TripId,
                });
                expect(createDelayedPassageRequestSpy).toHaveBeenCalledTimes(3);
                expect(nextSpy).toHaveBeenCalledTimes(1);
                expect(nextSpy.calls.allArgs()).toEqual([[1]]);
                tick(1100);
                expect(nextSpy).toHaveBeenCalledTimes(2);
                expect(nextSpy.calls.allArgs()).toEqual([[1], [3]]);
                expect(createDelayedPassageRequestSpy.calls.allArgs())
                    .toEqual([['1', 10000], ['2', 10000], ['3', 20000]]);
                subscription.unsubscribe();
            }));
        });
    });
});

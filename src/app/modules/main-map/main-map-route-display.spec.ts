import { fakeAsync, tick } from '@angular/core/testing';
import { IVehiclePath, IVehiclePathInfo, TripId } from '@donmahallem/trapeze-api-types';
import * as L from 'leaflet';
import { from, BehaviorSubject, Subscription } from 'rxjs';
import { ApiService } from 'src/app/services';
import { IData, MainMapRouteDisplay } from './main-map-route-display';

const testVehiclePath: IVehiclePath[] = [
    {
        color: '#FFFFFF',
        wayPoints: [{
            lat: 1,
            lon: 2,
            seq: '1',
        }, {
            lat: 3,
            lon: 4,
            seq: '2',
        }],
    },
];
describe('src/app/modules/main-map/main-map-route-display', () => {
    describe('MainMapRouteDisplay', () => {
        let apiSpyObject: jasmine.SpyObj<ApiService>;
        const mapSpy: jasmine.SpyObj<L.Map> = jasmine.createSpyObj(L.Map, ['addLayer']);
        const routeLayerSpyObj: jasmine.SpyObj<L.FeatureGroup> = jasmine.createSpyObj(L.FeatureGroup, ['clearLayers', 'addLayer']);
        let testInstance: MainMapRouteDisplay;
        beforeAll(() => {
            apiSpyObject = jasmine.createSpyObj(ApiService, ['getRouteByTripId']);
        });
        beforeEach(() => {
            testInstance = new MainMapRouteDisplay(mapSpy, apiSpyObject);
            (testInstance as any).routeLayer = routeLayerSpyObj;
        });
        afterEach(() => {
            const subscription: Subscription = (testInstance as any).subscription;
            if (subscription) {
                subscription.unsubscribe();
            }
            apiSpyObject.getRouteByTripId.calls.reset();
            routeLayerSpyObj.clearLayers.calls.reset();
            mapSpy.addLayer.calls.reset();
            routeLayerSpyObj.addLayer.calls.reset();
        });
        describe('constructor()', () => {
            it('should add the route layer', () => {
                // for some reason this fluctuates in calls
                // TODO: investigate and fix
                expect(mapSpy.addLayer.calls.count()).toEqual(1);
            });
        });
        describe('start()', () => {
            let subscriptionSpy: jasmine.SpyObj<Subscription>;
            beforeEach(() => {
                subscriptionSpy = jasmine.createSpyObj<Subscription>('Subscription', ['unsubscribe'], ['closed']);
            });
            describe('no observable started', () => {
                let valueSubject: BehaviorSubject<IData>;
                let setRoutePathsSpy: jasmine.Spy;
                const testTripId: TripId = 'testid' as TripId;
                const testVehiclePathInfo: IVehiclePathInfo = {
                    paths: testVehiclePath,
                } as any;
                beforeEach(() => {
                    valueSubject = (testInstance as any).updateSubject;
                    setRoutePathsSpy = spyOn(testInstance as any, 'setRoutePaths').and.callFake(() => { });
                    jasmine.clock().install();
                    apiSpyObject.getRouteByTripId.and.callFake(() =>
                        from([testVehiclePathInfo]));
                });

                afterEach(() => {
                    jasmine.clock().uninstall();
                });
                it('should propagate the event correctly debounced', () => {
                    testInstance.start();
                    valueSubject.next({ hovering: true, tripId: testTripId });
                    jasmine.clock().tick(50);
                    valueSubject.next({ hovering: false });
                    jasmine.clock().tick(400);
                    expect(setRoutePathsSpy).not.toHaveBeenCalled();
                    expect(routeLayerSpyObj.clearLayers).toHaveBeenCalledTimes(1);
                });
                it('should propagate the event correctly and set the route', fakeAsync(() => {
                    testInstance.start();
                    valueSubject.next({ hovering: true, tripId: testTripId });
                    tick(500);
                    expect(setRoutePathsSpy).toHaveBeenCalledTimes(1);
                    expect(routeLayerSpyObj.clearLayers).toHaveBeenCalledTimes(0);
                    expect(setRoutePathsSpy.calls.mostRecent().args).toEqual([testVehiclePath]);
                }));
                it('should propagate the event correctly and not set the route', fakeAsync(() => {
                    testInstance.start();
                    valueSubject.next({ hovering: false, tripId: testTripId });
                    tick(500);
                    expect(setRoutePathsSpy).not.toHaveBeenCalled();
                    expect(routeLayerSpyObj.clearLayers).toHaveBeenCalledTimes(1);
                }));
                it('should do start the observable if not started before', () => {
                    let subscription: Subscription = (testInstance as any).subscription;
                    expect(subscription).toBeUndefined();
                    testInstance.start();
                    subscription = (testInstance as any).subscription;
                    expect(subscription).toBeDefined();
                });
                it('should subscribe the internal observable if not started before or stopped before', () => {
                    (testInstance as any).subscription = subscriptionSpy;
                    subscriptionSpy.closed = true;
                    testInstance.start();
                    const subscription: Subscription = (testInstance as any).subscription;
                    expect(subscription).toEqual(subscriptionSpy);
                });
            });
            describe('observable started', () => {
                it('should not subscribe the internal observable if started before', () => {
                    (testInstance as any).subscription = subscriptionSpy;
                    subscriptionSpy.closed = false;
                    testInstance.start();
                    const subscription: Subscription = (testInstance as any).subscription;
                    expect(subscription).toEqual(subscriptionSpy);
                });
            });
        });
        describe('stop()', () => {

            it('should do nothing if not started before', () => {
                expect(() => {
                    const subscription: Subscription = (testInstance as any).subscription;
                    expect(subscription).toBeUndefined();
                    testInstance.stop();
                    expect(subscription).toBeUndefined();
                }).not.toThrow();
            });
            it('should unsubscribe the internal observable if started before', () => {
                testInstance.start();
                const subscription: Subscription = (testInstance as any).subscription;
                expect(subscription.closed).toBeFalse();
                testInstance.stop();
                expect(subscription.closed).toBeTrue();
            });
        });
        describe('setMouseHovering()', () => {
            const testIds: any = ['testString', undefined];
            const testIsHovering: boolean[] = [true, false];
            let nextSpy: jasmine.Spy;
            beforeEach(() => {
                const subject: BehaviorSubject<any> = (testInstance as any).updateSubject;
                nextSpy = spyOn(subject, 'next').and.callFake(() => { });
            });
            testIds.forEach((element) => {
                testIsHovering.forEach((element2) => {
                    it('should call next on the internal subject with (' + element + ',' + element2 + ')', () => {
                        testInstance.setMouseHovering(element2, element);
                        expect(nextSpy.calls.count()).toEqual(1);
                        expect(nextSpy.calls.mostRecent().args).toEqual([{
                            hovering: element2,
                            tripId: element,
                        }]);
                    });
                });
            });
        });
        describe('setRoutePaths()', () => {
            afterEach(() => {
                expect(routeLayerSpyObj.clearLayers.calls.count()).toEqual(1);
            });
            it('should not call addLayer if no paths are defined', () => {
                (testInstance as any).setRoutePaths(undefined);
                expect(routeLayerSpyObj.addLayer.calls.count()).toEqual(0);
            });
            it('should not call addLayer if an empty path list is provided', () => {
                (testInstance as any).setRoutePaths([]);
                expect(routeLayerSpyObj.addLayer.calls.count()).toEqual(0);
            });
            it('should call addLayer as often as paths are provided (1)', () => {
                (testInstance as any).setRoutePaths(testVehiclePath);
                expect(routeLayerSpyObj.addLayer.calls.count()).toEqual(1);
                expect(routeLayerSpyObj.clearLayers).toHaveBeenCalledBefore(routeLayerSpyObj.addLayer);
            });
            it('should call addLayer as often as paths are provided (2)', () => {
                (testInstance as any).setRoutePaths(testVehiclePath.concat(testVehiclePath));
                expect(routeLayerSpyObj.addLayer.calls.count()).toEqual(2);
                expect(routeLayerSpyObj.clearLayers).toHaveBeenCalledBefore(routeLayerSpyObj.addLayer);
            });

        });
    });
});

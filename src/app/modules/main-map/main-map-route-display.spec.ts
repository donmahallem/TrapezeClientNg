import * as L from 'leaflet';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ApiService } from 'src/app/services';
import { MainMapRouteDisplay } from './main-map-route-display';
describe('src/app/modules/main-map/main-map-route-display', () => {
    describe('MainMapRouteDisplay', () => {
        let getRouteSpy: jasmine.SpyObj<ApiService>;
        const mapSpy: jasmine.SpyObj<L.Map> = jasmine.createSpyObj(L.Map, ['addLayer']);
        let testInstance: MainMapRouteDisplay;
        beforeAll(() => {
            getRouteSpy = jasmine.createSpyObj(ApiService, ['getRouteByVehicleId']);
        });
        beforeEach(() => {
            testInstance = new MainMapRouteDisplay(mapSpy, getRouteSpy);
        });
        afterEach(() => {
            testInstance.stop();
            getRouteSpy.getRouteByVehicleId.calls.reset();
        });
        describe('constructor()', () => {
            it('should add the route layer', () => {
                expect(mapSpy.addLayer.calls.count()).toEqual(1);
                expect(mapSpy.addLayer.calls.mostRecent().args).toEqual([(testInstance as any).routeLayer]);
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
    });
});

import { Component, Directive, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MainMapRouteDisplay } from './main-map-route-display';
import * as L from "leaflet";
import { ApiService } from 'src/app/services';
import { Subscription } from 'rxjs';
describe('src/app/modules/main-map/main-map-route-display', () => {
    describe('MainMapRouteDisplay', () => {
        let getRouteSpy: jasmine.SpyObj<ApiService>;
        let mapSpy: jasmine.SpyObj<L.Map> = jasmine.createSpyObj(L.Map, ["addLayer"]);
        let testInstance: MainMapRouteDisplay;
        beforeAll(() => {
            getRouteSpy = jasmine.createSpyObj(ApiService, ["getRouteByVehicleId"]);
        })
        beforeEach(() => {
            testInstance = new MainMapRouteDisplay(mapSpy, getRouteSpy);
        });
        afterEach(() => {
            testInstance.stop();
            getRouteSpy.getRouteByVehicleId.calls.reset()
        })
        describe('stop()', () => {
            it('should unsubscribe the internal observable', () => {
                const subscription: Subscription = (testInstance as any).subscription;
                expect(subscription.closed).toBeFalse();
                testInstance.stop();
                expect(subscription.closed).toBeTrue();
            });
        });
    });
});

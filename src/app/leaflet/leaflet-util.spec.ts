import { Component, Directive, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ApiService } from 'src/app/services';
import { IWayPoint } from '@donmahallem/trapeze-api-types';
import { LeafletUtil } from './leaflet-util';
import { LatLng } from 'leaflet';
describe('src/app/leaflet/leaflet-util', () => {
    describe('LeafletUtil', () => {
        const testCoordinates: IWayPoint[] = new Array(10)
            .map((value: any, index: number): IWayPoint => {
                return {
                    lat: index * 100,
                    lon: 10000 - (index * 100),
                    seq: "" + index
                }
            });
        describe('convertWayPointToLatLng', () => {
            testCoordinates.forEach((value: IWayPoint) => {
                it('should convert the coordinates (' + value.lat + ',' + value.lon + ') correctly', () => {
                    const converted: LatLng = LeafletUtil.convertWayPointToLatLng(value);
                    expect(converted.lat).toEqual(value.lat / 3600000);
                    expect(converted.lng).toEqual(value.lon / 3600000);
                });
            });
        });
        describe('convertWayPointsToLatLng', () => {
            let convertSpy: jasmine.Spy;
            const testCoordinate: L.LatLng = new LatLng(1, 1);
            beforeAll(() => {
                convertSpy = spyOn(LeafletUtil, "convertWayPointToLatLng");
                convertSpy.and.callFake(() => {
                    console.log("BANANE");
                    return true;
                });
            })
            afterEach(() => {
                convertSpy.calls.reset();
            });
            it('should convert the coordinate list correctly', () => {
                const converted: LatLng[] = LeafletUtil.convertWayPointsToLatLng(testCoordinates);
                expect(converted.length).toEqual(testCoordinates.length);
                expect(convertSpy.calls.count()).toEqual(testCoordinates.length);
                expect(converted).toEqual(new Array(testCoordinates.length).map(() => testCoordinate));
            });
        });
    });
});

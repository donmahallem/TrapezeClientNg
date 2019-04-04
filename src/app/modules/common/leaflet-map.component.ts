
import { AfterViewInit, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { Subject, Subscription, Subscriber } from 'rxjs';
import './rotating-marker.patch';
import { UserLocationService, PositionStatus, PositionStatusCode, IAquiredPositionStatus } from 'src/app/services/user-location.service';
import { LocationChangeEvent } from '@angular/common';

export enum MapMoveEventType {
    NONE = 0,
    START = 1,
    END = 2,
}

export interface IMapMoveStartEvent {
    type: MapMoveEventType.START;
}

export interface IMapMoveEndEvent {
    type: MapMoveEventType.END;
}

export type MapMoveEvent = IMapMoveStartEvent | IMapMoveEndEvent;

export interface IMapBounds {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

export class UserLocationSubscriber extends Subscriber<PositionStatus>{
    public constructor(private cmp: LeafletMapComponent) {
        super();
    }

    public next(value: PositionStatus) {
        if (value.type === PositionStatusCode.AQUIRED) {
            this.cmp.setUserLocation((<IAquiredPositionStatus>value).position.coords);
        } else {
            this.cmp.setUserLocation(undefined);
        }
    }
}

export abstract class LeafletMapComponent implements AfterViewInit, OnDestroy {
    constructor(private elRef: ElementRef,
        protected zone: NgZone,
        protected userLocationService: UserLocationService) {
    }
    @ViewChild('mapcontainer') mapContainer;
    private map: L.Map;
    public readonly mapMove: Subject<MapMoveEvent> = new Subject();
    private mUserLocationSubscription: Subscription = undefined;
    private userLocationLayer: L.FeatureGroup;
    ngAfterViewInit() {
        this.zone.runOutsideAngular(() => {
            // Seems to be necessary to run ngZone updates EVERY SINGLE TIME!!!! the map is firing a drag event
            this.map = L.map(this.elRef.nativeElement, { zoomControl: false }).setView([54.3364478, 10.1510508], 14);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> '
                    + 'contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, '
                    + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                subdomains: ['a', 'b', 'c'],
            }).addTo(this.map);
            this.map.on('movestart', () => {
                this.mapMove.next({
                    type: MapMoveEventType.START,
                });
            });
            this.map.on('moveend', (...args: any[]) => {
                this.mapMove.next({
                    type: MapMoveEventType.END,
                });
            });
        });
        this.mUserLocationSubscription = this.userLocationService
            .userLocationObservable.subscribe(new UserLocationSubscriber(this));
        this.userLocationService.queryPosition();
    }

    public setUserLocation(coords: Coordinates): void {
        if (this.userLocationLayer) {
            this.userLocationLayer.clearLayers();
        } else {
            this.userLocationLayer = L.featureGroup();
            this.userLocationLayer.addTo(this.map);
        }
        if (coords === undefined)
            return;
        const radius: number = coords.accuracy / 2;
        const userPosition: [number, number] = [coords.latitude, coords.longitude];
        L.circle(userPosition, radius, {
            interactive: false
        }).addTo(this.userLocationLayer);
        L.circleMarker(userPosition, {
            color: '#0000FF',
            radius: 5,
            fillColor: '#0000FF',
            opacity: 0.2,
            fillOpacity: 0.9
        }).addTo(this.userLocationLayer);
    }

    public getMap(): L.Map | undefined {
        return this.map;
    }

    public addLayer(layer: L.Layer): L.Layer {
        return layer.addTo(this.map);
    }

    /**
     * wrapper for this.map.getBounds()
     */
    public get mapBounds(): L.LatLngBounds {
        return this.map.getBounds();
    }

    public ngOnDestroy(): void {
        if (this.mUserLocationSubscription)
            this.mUserLocationSubscription.unsubscribe();
    }
}

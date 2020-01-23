
import { AfterViewInit, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { Subject, Subscriber, Subscription, Observable } from 'rxjs';
import { SettingsService } from 'src/app/services/settings.service';
import { UserLocationService } from 'src/app/services/user-location.service';
import './rotating-marker.patch';
import { filter, shareReplay, map, startWith } from 'rxjs/operators';

/**
 * Map Move Event Type
 */
export enum MapMoveEventType {
    NONE = 0,
    START = 1,
    END = 2,
}

/**
 * Map Move Event with type start
 */
export interface IMapMoveStartEvent {
    type: MapMoveEventType.START;
}

/**
 * Map Move Event with type end
 */
export interface IMapMoveEndEvent {
    type: MapMoveEventType.END;
}
/**
 * Move Event
 */
export type MapMoveEvent = IMapMoveStartEvent | IMapMoveEndEvent;

/**
 * Current viewing map bounds
 */
export interface IMapBounds {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

export class UserLocationSubscriber extends Subscriber<Position> {
    public constructor(private cmp: LeafletMapComponent) {
        super();
    }

    public next(value: Position) {
        this.cmp.setUserLocation(value ? value.coords : undefined);
    }
}

export abstract class LeafletMapComponent implements AfterViewInit, OnDestroy {

    /**
     * wrapper for this.map.getBounds()
     */
    public get mapBounds(): L.LatLngBounds {
        return this.map.getBounds();
    }
    @ViewChild('mapcontainer', { static: false }) mapContainer;
    private readonly leafletEventSubject: Subject<L.LeafletEvent> = new Subject();
    public get leafletEvent(): Observable<L.LeafletEvent> {
        return this.leafletEventSubject.asObservable();
    }
    public readonly leafletZoomLevel: Observable<number> = this.leafletEventSubject
        .pipe(filter((evt: L.LeafletEvent): boolean => {
            switch (evt.type) {
                case "zoom":
                case "zoomstart":
                case "zoomend":
                    return true;
                default:
                    return false;
            }
        }), map((evt: L.LeafletEvent): number => {
            return evt.target.getZoom();
        }), startWith(this.settings.getInitialMapZoom()), shareReplay(1));
    public readonly leafletBounds: Observable<L.Bounds> = this.leafletEventSubject
        .pipe(filter((evt: L.LeafletEvent): boolean => {
            switch (evt.type) {
                case "move":
                case "movestart":
                case "moveend":
                    return true;
                default:
                    return false;
            }
        }), map((evt: L.LeafletEvent): L.Bounds => {
            return evt.target.getBounds();
        }), shareReplay(1));
    private map: L.Map;
    private mUserLocationSubscription: Subscription = undefined;
    private userLocationLayer: L.FeatureGroup;
    constructor(private elRef: ElementRef,
        protected zone: NgZone,
        protected userLocationService: UserLocationService,
        protected settings: SettingsService) {
    }
    ngAfterViewInit() {
        this.zone.runOutsideAngular(() => {
            // Seems to be necessary to run ngZone updates EVERY SINGLE TIME!!!! the map is firing a drag event
            this.map = L.map(this.elRef.nativeElement, { zoomControl: false })
                .setView(this.settings.getInitialMapCenter(), this.settings.getInitialMapZoom());
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> '
                    + 'contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, '
                    + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                subdomains: ['a', 'b', 'c'],
            }).addTo(this.map);
            // Attach event listeners
            ["movestart", "moveend", "zoom", "move", "zoomstart", "zoomend"]
                .forEach((eventType: string) => {
                    this.map.on(eventType, (evt: L.LeafletEvent) => {
                        this.leafletEventSubject.next(evt);
                    });
                });
        });
        this.mUserLocationSubscription = this.userLocationService
            .locationObservable.subscribe(new UserLocationSubscriber(this));
    }

    /**
     * Sets the user location. To clear the location set it to undefined
     * @param coords The coords or undefined
     */
    public setUserLocation(coords: Coordinates): void {
        if (this.userLocationLayer) {
            this.userLocationLayer.clearLayers();
        } else {
            this.userLocationLayer = L.featureGroup();
            this.userLocationLayer.addTo(this.map);
        }
        if (coords === undefined) {
            return;
        }
        const radius: number = coords.accuracy / 2;
        const userPosition: [number, number] = [coords.latitude, coords.longitude];
        L.circle(userPosition, radius, {
            interactive: false,
        }).addTo(this.userLocationLayer);
        L.circleMarker(userPosition, {
            color: '#0000FF',
            fillColor: '#0000FF',
            fillOpacity: 0.9,
            opacity: 0.1,
            radius: 5,
        }).addTo(this.userLocationLayer);
    }

    public getMap(): L.Map | undefined {
        return this.map;
    }

    public addLayer(layer: L.Layer): L.Layer {
        return layer.addTo(this.map);
    }

    public ngOnDestroy(): void {
        if (this.mUserLocationSubscription) {
            this.mUserLocationSubscription.unsubscribe();
        }
    }
}

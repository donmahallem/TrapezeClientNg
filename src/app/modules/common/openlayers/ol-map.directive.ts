
import { AfterViewInit, ElementRef, NgZone, OnDestroy } from '@angular/core';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SettingsService } from 'src/app/services/settings.service';
import './rotating-marker.patch';

export abstract class LeafletMapComponent implements AfterViewInit, OnDestroy {

    public readonly locationObservable: Observable<L.LocationEvent>;
    private map: Map;
    private tileLayer: L.TileLayer;
    private readonly locationSubject: BehaviorSubject<L.LocationEvent> = new BehaviorSubject(undefined);
    private locationSubscription: Subscription;
    constructor(private elRef: ElementRef,
        public readonly zone: NgZone,
        public readonly settings: SettingsService) {
        this.locationObservable = this.locationSubject.asObservable()
            .pipe(filter((val: L.LocationEvent) => val !== undefined));
    }
    public ngAfterViewInit(): void {/*
        this.locationSubscription = this.locationObservable
            .subscribe((evt: L.LocationEvent): void => {
                this.userLocationLayer.clearLayers();
                const radius: number = evt.accuracy / 2;
                L.circle(evt.latlng, radius, {
                    interactive: false,
                }).addTo(this.userLocationLayer);
                L.circleMarker(evt.latlng, {
                    color: '#0000FF',
                    fillColor: '#0000FF',
                    fillOpacity: 0.9,
                    opacity: 0.1,
                    radius: 5,
                }).addTo(this.userLocationLayer);
            });*/
        this.zone.runOutsideAngular(() => {
            // Seems to be necessary to run ngZone updates EVERY SINGLE TIME!!!! the map is firing a drag event
            this.map = new Map({
                layers: [
                    new TileLayer({
                        source: new XYZ({
                            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        }),
                    }),
                ],
                target: this.elRef.nativeElement,
                view: new View({
                    center: [0, 0],
                    zoom: 2,
                }),
            });
        });
    }

    public onBeforeSetView(map: L.Map): void {

    }

    public onAfterSetView(map: L.Map): void {

    }

    public getMap(): Map | undefined {
        return this.map;
    }

    public ngOnDestroy(): void {
        if (this.locationSubscription) {
            this.locationSubscription.unsubscribe();
        }
    }
}

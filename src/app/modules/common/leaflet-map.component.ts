
import { AfterViewInit, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SettingsService } from 'src/app/services/settings.service';
import './rotating-marker.patch';

export abstract class LeafletMapComponent implements AfterViewInit, OnDestroy {

    @ViewChild('mapcontainer', { static: false }) mapContainer;
    public readonly locationObservable: Observable<L.LocationEvent>;
    private map: L.Map;
    private tileLayer: L.TileLayer;
    private readonly locationSubject: BehaviorSubject<L.LocationEvent> = new BehaviorSubject(undefined);
    private locationSubscription: Subscription;
    private readonly userLocationLayer: L.FeatureGroup = L.featureGroup();
    constructor(private elRef: ElementRef,
                public readonly zone: NgZone,
                public readonly settings: SettingsService) {
        this.locationObservable = this.locationSubject.asObservable()
            .pipe(filter((val) => val !== undefined));
    }
    ngAfterViewInit() {
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
            });
        this.zone.runOutsideAngular(() => {
            // Seems to be necessary to run ngZone updates EVERY SINGLE TIME!!!! the map is firing a drag event
            this.map = L.map(this.elRef.nativeElement, { zoomControl: false });
            this.onBeforeSetView(this.map);
            this.map.setView(this.settings.getInitialMapCenter(), this.settings.getInitialMapZoom());
            this.tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> '
                    + 'contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, '
                    + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                subdomains: ['a', 'b', 'c'],
            }).addTo(this.map);
            this.tileLayer.bringToBack();
            this.onAfterSetView(this.map);
            this.map.locate({ watch: true });
            this.userLocationLayer.addTo(this.map);
            this.map.on('locationfound', ((evt: L.LocationEvent): void => {
                this.locationSubject.next(evt);
            }).bind(this));
        });
    }

    public onBeforeSetView(map: L.Map): void {

    }

    public onAfterSetView(map: L.Map): void {

    }

    public getMap(): L.Map | undefined {
        return this.map;
    }

    public ngOnDestroy(): void {
        if (this.getMap()) {
            this.getMap().stopLocate();
            this.getMap().remove();
        }
        if (this.locationSubscription) {
            this.locationSubscription.unsubscribe();
        }
    }
}

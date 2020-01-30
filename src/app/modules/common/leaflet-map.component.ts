
import { AfterViewInit, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { SettingsService } from 'src/app/services/settings.service';
import './rotating-marker.patch';

export abstract class LeafletMapComponent implements AfterViewInit, OnDestroy {

    @ViewChild('mapcontainer', { static: false }) mapContainer;
    private map: L.Map;
    private tileLayer: L.TileLayer;
    constructor(private elRef: ElementRef,
                public readonly zone: NgZone,
                public readonly settings: SettingsService) {
    }
    ngAfterViewInit() {
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
        });
    }

    public onBeforeSetView(map: L.Map): void {

    }

    public getMap(): L.Map | undefined {
        return this.map;
    }

    public ngOnDestroy(): void {
        if (this.getMap()) {
            this.getMap().stopLocate();
            this.getMap().remove();
        }
    }
}

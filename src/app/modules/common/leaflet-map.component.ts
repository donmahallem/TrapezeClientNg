
import { AfterViewInit, DoCheck, ElementRef, OnDestroy, Output, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { BehaviorSubject } from 'rxjs';
import './rotating-marker.patch';

export interface IMapBounds {
    left: number;
    right: number;
    top: number;
    bottom: number;
}
export abstract class LeafletMapComponent implements AfterViewInit, DoCheck, OnDestroy {
    constructor(private elRef: ElementRef) {
    }
    @ViewChild('mapcontainer') mapContainer;
    private map: L.Map;
    @Output()
    public readonly mapBounds: BehaviorSubject<IMapBounds> = new BehaviorSubject(undefined);

    ngAfterViewInit() {
        this.map = L.map(this.elRef.nativeElement, { zoomControl: false }).setView([54.3364478, 10.1510508], 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> '
                + 'contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, '
                + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            subdomains: ['a', 'b', 'c'],
        }).addTo(this.map);
        this.map.on('moveend', (...args: any[]) => {
            this.updateBoundsObservable.call(this);
        });
        this.updateBoundsObservable();
    }

    public getMap(): L.Map | undefined {
        return this.map;
    }

    public addLayer(layer: L.Layer): L.Layer {
        return layer.addTo(this.map);
    }

    public ngDoCheck(): void {
        if (this.map !== undefined) {
            this.map.invalidateSize();
        }
    }

    public updateBoundsObservable() {
        const left: number = this.map.getBounds().getWest();
        const right: number = this.map.getBounds().getEast();
        const top: number = this.map.getBounds().getNorth();
        const bottom: number = this.map.getBounds().getSouth();
        const bounds: IMapBounds = {
            bottom: bottom,
            left: left,
            right: right,
            top: top,
        };
        this.mapBounds.next(bounds);
    }

    public ngOnDestroy(): void {
    }
}

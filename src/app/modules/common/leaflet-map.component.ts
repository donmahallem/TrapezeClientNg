
import { AfterViewInit, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { Subject } from 'rxjs';
import './rotating-marker.patch';

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
export abstract class LeafletMapComponent implements AfterViewInit, OnDestroy {
    constructor(private elRef: ElementRef, private zone: NgZone) {
    }
    @ViewChild('mapcontainer') mapContainer;
    private map: L.Map;
    public readonly mapMove: Subject<MapMoveEvent> = new Subject();
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
    /*
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
        }*/

    public ngOnDestroy(): void {
    }
}


import { ElementRef, NgZone } from '@angular/core';
import * as L from 'leaflet';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, share } from 'rxjs/operators';
import { SettingsService } from 'src/app/services/settings.service';
import { LeafletMapComponent } from './leaflet-map.component';

export abstract class InteractiveLeafletMapComponent extends LeafletMapComponent {
    public readonly leafletEvent: Observable<L.LeafletEvent>;
    public readonly leafletBoundsEvent: Observable<L.LatLngBounds>;
    public readonly leafletZoomEvent: Observable<number>;

    private readonly leafletEventSubject: Subject<L.LeafletEvent>;

    private readonly eventNames: string[] = ['zoomlevelschange', 'unload', 'viewreset', 'load', 'zoomstart',
        'movestart', 'zoom', 'move', 'zoomend', 'moveend', 'autopanstart',
        'dragstart', 'drag', 'add', 'remove', 'loading', 'error', 'update',
        'down', 'predrag'];
    constructor(elRef: ElementRef,
                zone: NgZone,
                settings: SettingsService) {
        super(elRef, zone, settings);
        this.leafletEventSubject = new Subject();
        this.leafletEvent = this.leafletEventSubject
            .asObservable()
            .pipe(share());
        this.leafletBoundsEvent = this.leafletEvent
            .pipe(filter((evt: L.LeafletEvent): boolean => {
                switch (evt.type) {
                    case 'move':
                    case 'zoom':
                    case 'moveend':
                    case 'zoomend':
                    case 'load':
                        return true;
                    default: return false;
                }
            }), map((evt: L.LeafletEvent): L.LatLngBounds =>
                evt.target.getBounds()), distinctUntilChanged((x: L.LatLngBounds, y: L.LatLngBounds): boolean => {
                    if (x && y) {
                        return x.equals(y);
                    }
                    return false;
                }), share());
        this.leafletZoomEvent = this.leafletEvent
            .pipe(filter((evt: L.LeafletEvent): boolean => {
                switch (evt.type) {
                    case 'zoomstart':
                    case 'zoom':
                    case 'zoomend':
                    case 'load':
                        return true;
                    default: return false;
                }
            }), map((evt: L.LeafletEvent): number => {
                const map: L.Map = evt.target;
                return map.getZoom();
            }), distinctUntilChanged((x: number, y: number): boolean =>
                x === y), share());
    }
    public onBeforeSetView(map: L.Map): void {
        super.onBeforeSetView(map);
        this.eventNames.forEach((eventName: string): void => {
            map.on(eventName, (evt: L.LeafletEvent): void => {
                this.leafletEventSubject.next(evt);
            });
        });
    }
}

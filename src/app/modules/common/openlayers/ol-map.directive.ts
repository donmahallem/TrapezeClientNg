
import { AfterViewInit, ElementRef, HostListener, NgZone, OnDestroy } from '@angular/core';
import { Map, View } from 'ol';
import { defaults } from 'ol/interaction';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { SettingsService } from 'src/app/services/settings.service';

export abstract class OlMapComponent implements AfterViewInit, OnDestroy {

    public readonly locationObservable: Observable<L.LocationEvent>;
    private map: Map;
    private tileLayer: L.TileLayer;
    private readonly locationSubject: BehaviorSubject<L.LocationEvent> = new BehaviorSubject(undefined);
    private locationSubscription: Subscription;
    constructor(private elRef: ElementRef,
                public readonly zone: NgZone,
                public readonly settings: SettingsService) {
    }
    @HostListener('window:scroll') scrolling() {
        console.log('scrolling');
    }
    public ngAfterViewInit(): void {
        this.zone.runOutsideAngular(() => {
            // Seems to be necessary to run ngZone updates EVERY SINGLE TIME!!!! the map is firing a drag event
            this.map = new Map({
                interactions: defaults({ mouseWheelZoom: true, dragPan: true }),
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
            this.map.updateSize();
            console.log('Map set', this.map);
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

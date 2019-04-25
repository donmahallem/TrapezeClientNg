import { AfterViewInit, Directive, ElementRef, Input, NgZone, OnDestroy } from '@angular/core';
import { IStopLocation } from '@donmahallem/trapeze-api-types';
import * as L from 'leaflet';
import { BehaviorSubject } from 'rxjs';
import { createStopIcon } from 'src/app/leaflet';
import { SettingsService } from 'src/app/services/settings.service';
import { UserLocationService } from 'src/app/services/user-location.service';
import { LeafletMapComponent } from '../common/leaflet-map.component';

@Directive({
    selector: 'map[appStopLocation]',
})
export class StopLocationMapDirective extends LeafletMapComponent implements AfterViewInit, OnDestroy {
    constructor(elRef: ElementRef,
        userLocationService: UserLocationService,
        zone: NgZone,
        settingsService: SettingsService) {
        super(elRef, zone, userLocationService, settingsService);
    }
    @Input('location')
    public set location(loc: IStopLocation) {
        this.stopLocationSubject.next(loc);
    }

    private stopMarkerLayer: L.FeatureGroup = undefined;

    private stopLocationSubject: BehaviorSubject<IStopLocation> = new BehaviorSubject(undefined);

    public ngAfterViewInit() {
        super.ngAfterViewInit();
        this.addMarker();
        this.getMap().dragging.disable();
        this.getMap().touchZoom.disable();
        this.getMap().doubleClickZoom.disable();
        this.getMap().scrollWheelZoom.disable();
        this.getMap().eachLayer((layer: L.Layer) => {
            if (layer instanceof L.TileLayer) {
                layer.options.attribution = '';
                layer.redraw();
            }
        });
    }

    public addMarker(): void {
        this.stopLocationSubject
            .subscribe((location) => {
                if (this.stopMarkerLayer) {
                    this.stopMarkerLayer.clearLayers();
                } else {
                    this.stopMarkerLayer = new L.FeatureGroup();
                    this.stopMarkerLayer.addTo(this.getMap());
                }
                if (location) {
                    const stopIcon: L.Icon = createStopIcon();
                    const marker: L.Marker = L.marker([location.latitude / 3600000, location.longitude / 3600000],
                        {
                            clickable: false,
                            icon: stopIcon,
                            interactive: false,
                            title: location.name,
                            zIndexOffset: 100,
                        });
                    marker.addTo(this.stopMarkerLayer);
                    this.getMap().panTo({
                        alt: 2000,
                        lat: location.latitude / 3600000,
                        lng: location.longitude / 3600000,
                    },
                        { animate: true });
                }
            });
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }

}

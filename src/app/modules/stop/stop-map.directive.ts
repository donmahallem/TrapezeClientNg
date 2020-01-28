import { Location } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, Input, NgZone, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';
import { createStopIcon } from 'src/app/leaflet';
import { SettingsService } from 'src/app/services/settings.service';
import { UserLocationService } from 'src/app/services/user-location.service';
import { LeafletMapComponent } from '../common/leaflet-map.component';
import { StopInfoService } from './stop-info.service';

/**
 * Directive displaying a map with the StopLocation
 */
@Directive({
    selector: 'map[appStopLocation]'
})
export class StopLocationMapDirective extends LeafletMapComponent implements AfterViewInit, OnDestroy {
    private stopMarkerLayer: L.FeatureGroup = undefined;
    private locationSubscription: Subscription;
    constructor(elRef: ElementRef,
        userLocationService: UserLocationService,
        zone: NgZone,
        settingsService: SettingsService,
        public stopService: StopInfoService,
        public locationService: Location) {
        super(elRef, zone, userLocationService, settingsService);
    }

    public ngAfterViewInit() {
        super.ngAfterViewInit();
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
        this.locationSubscription = this.stopService.locationObservable
            .subscribe((location) => {
                if (this.stopMarkerLayer) {
                    this.stopMarkerLayer.clearLayers();
                } else {
                    this.stopMarkerLayer = new L.FeatureGroup();
                    this.stopMarkerLayer.addTo(this.getMap());
                }
                if (location) {
                    const stopIcon: L.Icon = createStopIcon(this.locationService);
                    const marker: L.Marker = L.marker([location.latitude / 3600000, location.longitude / 3600000],
                        {
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
        if (this.locationSubscription) {
            this.locationSubscription.unsubscribe();
        }
    }

}

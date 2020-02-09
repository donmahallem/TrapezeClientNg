import { Location } from '@angular/common';
import { Directive, ElementRef, Input, NgZone, SimpleChanges } from '@angular/core';
import { IStopLocation } from '@donmahallem/trapeze-api-types';
import * as L from 'leaflet';
import { createStopIcon, LeafletUtil } from 'src/app/leaflet';
import { SettingsService } from 'src/app/services/settings.service';
import { HeaderMapDirective } from './header-map.directive';

/**
 * Directive displaying a map with the StopLocation
 */
@Directive({
    selector: 'map[appStopLocationHeader]',
})
export class StopLocationHeaderMapDirective extends HeaderMapDirective {
    @Input()
    public stopLocation: IStopLocation;
    constructor(elRef: ElementRef,
                zone: NgZone,
                settingsService: SettingsService,
                public locationService: Location) {
        super(elRef, zone, settingsService);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if ('stopLocation' in changes) {
            this.updateLocation();
        }
    }

    public updateLocation(): void {
        this.markerLayer.clearLayers();
        if (this.stopLocation) {
            const stopIcon: L.Icon = createStopIcon(this.locationService);
            const stopCoordinates: L.LatLng = LeafletUtil.convertCoordToLatLng(this.stopLocation);
            const marker: L.Marker = L.marker(stopCoordinates,
                {
                    icon: stopIcon,
                    interactive: false,
                    title: this.stopLocation.name,
                    zIndexOffset: 100,
                });
            marker.addTo(this.markerLayer);
            if (this.getMap()) {
                this.getMap().panTo(stopCoordinates,
                    { animate: true });
            }
        }
    }

}

import { Location } from '@angular/common';
import { Directive, ElementRef, Input, NgZone, SimpleChanges } from '@angular/core';
import { IVehicleLocation } from '@donmahallem/trapeze-api-types';
import * as L from 'leaflet';
import { createStopIcon, LeafletUtil } from 'src/app/leaflet';
import { SettingsService } from 'src/app/services/settings.service';
import { HeaderMapDirective } from './header-map.directive';

/**
 * Directive displaying a map with the StopLocation
 */
@Directive({
    selector: 'map[appVehicleLocationHeader]',
})
export class VehicleLocationHeaderMapDirective extends HeaderMapDirective {
    @Input()
    public vehicleLocation: IVehicleLocation;
    constructor(elRef: ElementRef,
                zone: NgZone,
                settingsService: SettingsService,
                public locationService: Location) {
        super(elRef, zone, settingsService);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if ('vehicleLocation' in changes) {
            this.updateLocation();
        }
    }

    public updateLocation(): void {
        this.markerLayer.clearLayers();
        if (this.vehicleLocation) {
            const stopIcon: L.Icon = createStopIcon(this.locationService);
            const stopCoordinates: L.LatLng = LeafletUtil.convertCoordToLatLng(this.vehicleLocation);
            const marker: L.Marker = L.marker(stopCoordinates,
                {
                    icon: stopIcon,
                    interactive: false,
                    title: this.vehicleLocation.name,
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

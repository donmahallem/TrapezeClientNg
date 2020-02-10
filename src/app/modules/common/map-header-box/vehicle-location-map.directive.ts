import { Location } from '@angular/common';
import { Directive, ElementRef, NgZone } from '@angular/core';
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
export class VehicleLocationHeaderMapDirective extends HeaderMapDirective<IVehicleLocation> {
    constructor(elRef: ElementRef,
                zone: NgZone,
                settingsService: SettingsService,
                public locationService: Location) {
        super(elRef, zone, settingsService);
    }

    public updateLocation(marker: IVehicleLocation): void {
        this.markerLayer.clearLayers();
        if (marker) {
            const stopIcon: L.Icon = createStopIcon(this.locationService);
            const stopCoordinates: L.LatLng = LeafletUtil.convertCoordToLatLng(marker);
            const mapMarker: L.Marker = L.marker(stopCoordinates,
                {
                    icon: stopIcon,
                    interactive: false,
                    title: marker.name,
                    zIndexOffset: 100,
                });
            mapMarker.addTo(this.markerLayer);
            if (this.getMap()) {
                this.getMap().panTo(stopCoordinates,
                    { animate: true });
            }
        }
    }

}

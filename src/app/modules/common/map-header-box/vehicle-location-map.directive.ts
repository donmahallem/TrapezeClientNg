import { Directive, ElementRef, NgZone, OnDestroy } from '@angular/core';
import { IVehicleLocation } from '@donmahallem/trapeze-api-types';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';
import { createVehicleIcon, LeafletUtil } from 'src/app/leaflet';
import { SettingsService } from 'src/app/services/settings.service';
import { RotatingMarker, RotatingMarkerOptions } from '../rotating-marker.patch';
import { HeaderMapDirective } from './header-map.directive';
import { VehicleMapHeaderService } from './vehicle-map-header.service';

/**
 * Directive displaying a map with the StopLocation
 */
@Directive({
    selector: 'map[appVehicleLocationHeader]',
})
export class VehicleLocationHeaderMapDirective extends HeaderMapDirective implements OnDestroy {

    public vehicleMarker?: RotatingMarker;
    private updateSubscription: Subscription;
    constructor(elRef: ElementRef,
                zone: NgZone,
                settingsService: SettingsService,
                headerService: VehicleMapHeaderService) {
        super(elRef, zone, settingsService);
    }

    public createVehicleMarker(name: string, heading: number, coord: L.LatLng): RotatingMarker {
        const vehicleIcon: L.DivIcon = createVehicleIcon(heading, name, 40);
        const markerT: RotatingMarker = L.marker(coord, {
            icon: vehicleIcon,
            interactive: false,
            rotationAngle: heading - 90,
            title: name,
            zIndexOffset: 100,
        } as RotatingMarkerOptions) as RotatingMarker;
        return markerT;
    }
    public updateVehicle(vehicle: IVehicleLocation): void {
        const vehicleCoords: L.LatLng = LeafletUtil.convertCoordToLatLng(vehicle);
        if (this.vehicleMarker === undefined || !this.markerLayer.hasLayer(this.vehicleMarker)) {
            this.vehicleMarker = this.createVehicleMarker(vehicle.name, vehicle.heading, vehicleCoords);
            this.vehicleMarker.addTo(this.markerLayer);
        } else {
            this.vehicleMarker.setRotationAngle(vehicle.heading - 90);
            this.vehicleMarker.setLatLng(vehicleCoords);
        }
        this.panMapTo(vehicleCoords);
    }

    public onAfterSetView(map: L.Map): void {
        super.onAfterSetView(map);

    }
    public ngOnDestroy(): void {
        if (this.updateSubscription) {
            this.updateSubscription.unsubscribe();
        }
        super.ngOnDestroy();
    }
}

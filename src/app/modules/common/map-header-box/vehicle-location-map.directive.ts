import { Location } from '@angular/common';
import { Directive, ElementRef, Input, NgZone, SimpleChange, SimpleChanges } from '@angular/core';
import { ITripPassages, ITripRoute, IVehicleLocation } from '@donmahallem/trapeze-api-types';
import * as L from 'leaflet';
import { createVehicleIcon, LeafletUtil } from 'src/app/leaflet';
import { ApiService } from 'src/app/services';
import { SettingsService } from 'src/app/services/settings.service';
import { TimestampedVehicleLocation } from 'src/app/services/vehicle.service';
import { RotatingMarker, RotatingMarkerOptions } from '../rotating-marker.patch';
import { HeaderMapDirective } from './header-map.directive';

interface VehicleRoute {
    vehicle?: IVehicleLocation;
    passages?: ITripPassages;
}

/**
 * Directive displaying a map with the StopLocation
 */
@Directive({
    selector: 'map[appVehicleLocationHeader]',
})
export class VehicleLocationHeaderMapDirective extends HeaderMapDirective {

    @Input()
    public vehicle?: IVehicleLocation;
    @Input()
    public route?: ITripRoute;

    public vehicleMarker?: RotatingMarker;
    constructor(elRef: ElementRef,
                zone: NgZone,
                settingsService: SettingsService,
                public apiService: ApiService,
                public locationService: Location) {
        super(elRef, zone, settingsService);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if ('vehicle' in changes) {
            const change: SimpleChange = changes.vehicle;
            const curVehicle: TimestampedVehicleLocation = change.currentValue;
            const preVehicle: TimestampedVehicleLocation = change.previousValue;
            if (curVehicle && preVehicle && curVehicle.id === preVehicle.id) {
                this.updateVehicle(curVehicle);
            } else if (curVehicle) {
                this.removeMarker(this.vehicleMarker);
                this.updateVehicle(curVehicle);
            } else {
                this.removeMarker(this.vehicleMarker);
            }
        }
    }

    public createVehicleMarker(name: string, heading: number, coord: L.LatLng): RotatingMarker {
        const vehicleIcon: L.DivIcon = createVehicleIcon(heading, name, 40);
        const markerT: RotatingMarker = L.marker(coord, {
            icon: vehicleIcon,
            rotationAngle: heading - 90,
            title: name,
            interactive: false,
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

}

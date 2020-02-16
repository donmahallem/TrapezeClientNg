import { Directive, ElementRef, NgZone, OnDestroy } from '@angular/core';
import { IVehicleLocation, IVehiclePathInfo } from '@donmahallem/trapeze-api-types';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { createVehicleIcon, LeafletUtil } from 'src/app/leaflet';
import { runOutsideZone } from 'src/app/rxjs-util/run-outside-zone';
import { SettingsService } from 'src/app/services/settings.service';
import { RotatingMarker, RotatingMarkerOptions } from '../rotating-marker.patch';
import { HeaderMapDirective } from './header-map.directive';
import { IStatus, VehicleMapHeaderService } from './vehicle-map-header.service';

/**
 * Directive displaying a map with the StopLocation
 */
@Directive({
    selector: 'map[appVehicleLocationHeader]',
})
export class VehicleLocationHeaderMapDirective extends HeaderMapDirective implements OnDestroy {

    public vehicleMarker?: RotatingMarker;
    private updateVehicleSubscription: Subscription;
    private updateRouteSubscription: Subscription;
    private routePolyline: L.Polyline;
    constructor(elRef: ElementRef,
                zone: NgZone,
                settingsService: SettingsService,
                public headerService: VehicleMapHeaderService) {
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

    public updateRoute(route: IVehiclePathInfo): void {
        if (this.routePolyline && this.markerLayer.hasLayer(this.routePolyline)) {
            this.markerLayer.removeLayer(this.routePolyline);
        }
        if (route) {
            for (const path of route.paths) {
                const pointList: L.LatLng[] = LeafletUtil.convertWayPointsToLatLng(path.wayPoints);
                this.routePolyline = L.polyline(pointList, {
                    color: '#FF0000',
                    opacity: 0.8,
                    smoothFactor: 1,
                    weight: 3,
                });
                this.routePolyline.addTo(this.markerLayer);
            }
        }
    }

    public onAfterSetView(map: L.Map): void {
        super.onAfterSetView(map);
        this.updateVehicleSubscription = this.headerService
            .createVehicleDataObservable()
            .pipe(tap((tapValue: IStatus) => {
                /**
                 * Required to set blur inside angular zone
                 */
                // tslint:disable-next-line:triple-equals
                this.blur = (tapValue.location == undefined);
            }), runOutsideZone(this.zone))
            .subscribe((loc: IStatus): void => {
                this.updateVehicle(loc.location);
                this.updateRoute(loc.route);
            });
    }
    public ngOnDestroy(): void {
        if (this.updateVehicleSubscription) {
            this.updateVehicleSubscription.unsubscribe();
        }
        if (this.updateRouteSubscription) {
            this.updateRouteSubscription.unsubscribe();
        }
        super.ngOnDestroy();
    }
}

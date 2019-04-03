import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { combineLatest, of, timer, Subscription } from 'rxjs';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';
import { StopLocation } from '../models/stop-location.model';
import { IMapBounds, LeafletMapComponent } from '../modules/common/leaflet-map.component';
import { StopPointService } from '../services/stop-point.service';
import { VehicleLocation } from './../models';
import { ApiService } from './../services';

@Directive({
    selector: 'map[appMainMap]',
})
export class MainMapDirective extends LeafletMapComponent implements AfterViewInit, OnDestroy {

    private stopMarkerLayer: L.FeatureGroup = undefined;
    private vehicleMarkerLayer: L.FeatureGroup = undefined;
    private vehicleUpdateSubscription: Subscription;
    constructor(elRef: ElementRef,
        private apiService: ApiService,
        private router: Router,
        private stopService: StopPointService) {
        super(elRef);
    }
    public createStopIcon() {
        if (false) {
            return L.divIcon({ className: 'my-div-icon', html: 'JJ' });
        } else {
            return L.icon({
                iconAnchor: [8, 8], // point of the icon which will correspond to marker's location
                // shadowUrl: 'leaf-shadow.png',
                iconSize: [16, 16], // size of the icon
                iconUrl: 'assets/iconmonstr-part-24.png',
                popupAnchor: [8, 8], // point from which the popup should open relative to the iconAnchor
                shadowAnchor: [32, 32],  // the same for the shadow
                shadowSize: [24, 24], // size of the shadow
            });
        }
    }

    public ngAfterViewInit() {
        super.ngAfterViewInit();
        this.addMarker();
        this.startVehicleUpdater();
    }

    public startVehicleUpdater(): void {

        this.vehicleUpdateSubscription = combineLatest(timer(0, 5000), this.mapBounds)
            .pipe(
                map((a) => a[1]),
                filter(num => num !== null),
                mergeMap((bounds: IMapBounds) => {
                    return this.apiService.getVehicleLocations(bounds);
                }),
                catchError((err: Error) => {
                    return of({});
                }))
            .subscribe((res) => {
                if (this.vehicleMarkerLayer !== undefined) {
                    this.vehicleMarkerLayer.clearLayers();
                } else {
                    this.vehicleMarkerLayer = L.featureGroup();
                    this.vehicleMarkerLayer.addTo(this.getMap());
                    this.vehicleMarkerLayer.on('click', this.markerOnClick.bind(this));
                }
                if (res && Array.isArray(res.vehicles)) {
                    for (const veh of res.vehicles) {
                        this.addVehicleMarker(veh).addTo(this.vehicleMarkerLayer);
                    }
                }
            });
    }

    public markerOnClick(e) {
        this.router.navigate(['passages', e.sourceTarget.data.tripId]);
    }
    public addVehicleMarker(vehicle: VehicleLocation): L.Marker {
        const greenIcon = L.divIcon({
            className: 'vehiclemarker',
            html: '<span>' + vehicle.name.split(' ')[0] + '</span>',
            iconAnchor: [16, 16], // point of the icon which will correspond to marker's location
            iconSize: [32, 32], // size of the icon
            popupAnchor: [12, 12], // point from which the popup should open relative to the iconAnchor
            shadowAnchor: [32, 32],  // the same for the shadow
            shadowSize: [24, 24], // size of the shadow
        });
        const markerT: any = L.marker([vehicle.latitude / 3600000, vehicle.longitude / 3600000], <any>
            {
                icon: greenIcon,
                rotationAngle: vehicle.heading - 90,
                title: vehicle.name,
                zIndexOffset: 100,
            });
        markerT.data = vehicle;
        return markerT;
    }
    public addMarker() {
        this.stopService.stopLocationsObservable
            .subscribe((stops: StopLocation[]) => {
                const stopList: L.Marker[] = [];
                for (const stop of stops) {
                    if (stop === null) {
                        continue;
                    }
                    const greenIcon = this.createStopIcon();
                    const markerT: L.Marker = L.marker([stop.latitude / 3600000, stop.longitude / 3600000],
                        {
                            clickable: true,
                            icon: greenIcon,
                            riseOffset: 10,
                            riseOnHover: true,
                            title: stop.name,
                            zIndexOffset: 10,
                        });
                    (<any>markerT).data = stop;
                    stopList.push(markerT);
                }
                if (this.stopMarkerLayer !== undefined) {
                    this.stopMarkerLayer.remove();
                }
                const featureGroup: L.FeatureGroup = L.featureGroup(stopList);
                this.stopMarkerLayer = featureGroup.addTo(this.getMap());
                featureGroup.on('click', this.stopMarkerOnClick.bind(this));
            });
    }

    public stopMarkerOnClick(event: { sourceTarget: { data: StopLocation } }) {
        this.router.navigate(['stop', event.sourceTarget.data.shortName]);
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.vehicleUpdateSubscription) {
            this.vehicleUpdateSubscription.unsubscribe();
        }
    }

}

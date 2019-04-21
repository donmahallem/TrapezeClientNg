import { AfterViewInit, Directive, ElementRef, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { IVehicleLocation, IVehicleLocationList } from '@donmahallem/trapeze-api-types';
import * as L from 'leaflet';
import { combineLatest, of, timer, Observable, Subscriber, Subscription } from 'rxjs';
import { catchError, filter, flatMap, map, startWith } from 'rxjs/operators';
import { createStopIcon } from '../../leaflet';
import { StopLocation } from '../../models/stop-location.model';
import { IMapBounds, LeafletMapComponent, MapMoveEvent, MapMoveEventType } from '../../modules/common/leaflet-map.component';
import { StopPointService } from '../../services/stop-point.service';
import { UserLocationService } from '../../services/user-location.service';
import { ApiService } from './../../services';
import { MatSnackBar } from '@angular/material';

export class VehicleLoadSubscriber extends Subscriber<IVehicleLocationList> {

    public constructor(private mainMap: MainMapDirective) {
        super();
    }
    public next(res: IVehicleLocationList): void {
        this.mainMap.setVehicles(res);
    }
}

@Directive({
    selector: 'map[appMainMap]',
})
export class MainMapDirective extends LeafletMapComponent implements AfterViewInit, OnDestroy {
    constructor(elRef: ElementRef,
        private apiService: ApiService,
        private router: Router,
        private stopService: StopPointService,
        userLocationService: UserLocationService,
        private snackBar: MatSnackBar,
        zone: NgZone) {
        super(elRef, zone, userLocationService);
    }

    private stopMarkerLayer: L.FeatureGroup = undefined;
    private vehicleMarkerLayer: L.FeatureGroup = undefined;
    private vehicleUpdateSubscription: Subscription;

    public setVehicles(vehicles: IVehicleLocationList): void {
        if (this.vehicleMarkerLayer !== undefined) {
            this.vehicleMarkerLayer.clearLayers();
        } else {
            this.vehicleMarkerLayer = L.featureGroup();
            this.vehicleMarkerLayer.addTo(this.getMap());
            this.vehicleMarkerLayer.on('click', this.markerOnClick.bind(this));
        }
        if (vehicles && Array.isArray(vehicles.vehicles)) {
            for (const veh of vehicles.vehicles) {
                if (veh.isDeleted === true) {
                    continue;
                }
                this.addVehicleMarker(<IVehicleLocation>veh).addTo(this.vehicleMarkerLayer);
            }
        }
    }

    public ngAfterViewInit() {
        super.ngAfterViewInit();
        this.addMarker();
        this.startVehicleUpdater();
        const ourCustomControl = L.Control.extend({
            onAdd: () => {
                const container = L.DomUtil.create('i', 'material-icons leaflet-bar leaflet-control leaflet-control-custom');
                container.style.backgroundColor = 'white';
                container.style.width = '42px';
                container.style.height = '42px';
                container.style.lineHeight = '42px';
                container.style.textAlign = 'center';
                container.style.verticalAlign = 'center';
                container.style.cursor = 'pointer';
                container.innerHTML = 'my_location';
                container.style.userSelect = 'none';
                container.style.msUserSelect = 'none';
                container.onclick = () => {
                    if (this.userLocationService.location) {
                        const pos: Position = this.userLocationService.location;
                        this.getMap().panTo({
                            alt: 5000,
                            lat: pos.coords.latitude, // / 3600000,
                            lng: pos.coords.longitude, // / 3600000,
                        },
                            { animate: true });
                    } else {
                        this.snackBar.open("No location acquired yet!",
                            undefined,
                            {
                                duration: 2000
                            });
                    }
                };
                return container;
            },
            options: {
                position: 'bottomright',
                // control position - allowed: 'topleft', 'topright', 'bottomleft', 'bottomright'
            },
        });
        this.getMap().addControl(new ourCustomControl());
    }

    public startVehicleUpdater(): void {
        // as mapMove doesn't emit on init this needs to be provided to load atleast once
        const primedMoveObservable: Observable<MapMoveEvent> = this.mapMove.pipe(
            startWith(<MapMoveEvent>{
                type: MapMoveEventType.END,
            }));
        this.vehicleUpdateSubscription = combineLatest(timer(0, 5000), primedMoveObservable)
            .pipe(
                map((value: [number, MapMoveEvent]): MapMoveEvent => {
                    return value[1];
                }),
                filter((event: MapMoveEvent): boolean => {
                    return (event.type === MapMoveEventType.END);
                }),
                flatMap((moveEvent: MapMoveEvent) => {
                    const bounds: IMapBounds = {
                        bottom: this.mapBounds.getSouth(),
                        left: this.mapBounds.getWest(),
                        right: this.mapBounds.getEast(),
                        top: this.mapBounds.getNorth(),
                    };
                    return this.apiService.getVehicleLocations(bounds);
                }),
                catchError((err: Error) => {
                    return of({});
                }))
            .subscribe(new VehicleLoadSubscriber(this));
    }

    public markerOnClick(event) {
        // needs to be taken back into the ng zone
        this.zone.run(() => {
            this.router.navigate(['passages', event.sourceTarget.data.tripId]);
        });
    }
    public addVehicleMarker(vehicle: IVehicleLocation): L.Marker {
        const greenIcon = L.divIcon({
            className: vehicle.heading > 180 ? 'vehiclemarker-rotated' : 'vehiclemarker',
            html: '<span>' + vehicle.name.split(' ')[0] + '</span>',
            iconAnchor: [20, 20], // point of the icon which will correspond to marker's location
            iconSize: [40, 40], // size of the icon
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
                    const greenIcon = createStopIcon();
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
        // needs to be taken back into the ng zone
        this.zone.run(() => {
            this.router.navigate(['stop', event.sourceTarget.data.shortName]);
        });
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.vehicleUpdateSubscription) {
            this.vehicleUpdateSubscription.unsubscribe();
        }
    }

}

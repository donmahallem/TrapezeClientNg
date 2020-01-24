import { Location } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, NgZone, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import {
    IStopLocation,
    ITripPassages,
    IVehicleLocation,
    IVehicleLocationList,
    IStopLocations,
    IStopPointLocation,
    IStopPointLocations
} from '@donmahallem/trapeze-api-types';
import * as L from 'leaflet';
import { combineLatest, from, timer, Observable, Subscriber, Subscription } from 'rxjs';
import { catchError, filter, flatMap, map, startWith, debounceTime } from 'rxjs/operators';
import { SettingsService } from 'src/app/services/settings.service';
import { createStopIcon, createVehicleIcon } from '../../leaflet';
import { LeafletMapComponent, MapMoveEvent, MapMoveEventType } from '../../modules/common/leaflet-map.component';
import { StopPointService } from '../../services/stop-point.service';
import { UserLocationService } from '../../services/user-location.service';
import { ApiService } from './../../services';
import { MainMapRouteDisplayHandler } from './main-map-route-display-handler';
import { VehicleService } from 'src/app/services/vehicle.service';

export class VehicleLoadSubscriber extends Subscriber<IVehicleLocationList> {

    public constructor(private mainMap: MainMapDirective) {
        super();
    }
    public next(res: IVehicleLocationList): void {
        this.mainMap.setVehicles(res);
    }
}

type StopMarkers = L.Marker & {
    stopPoint?: IStopPointLocation;
    stop?: IStopLocation;
}
@Directive({
    selector: 'map[appMainMap]',
})
/**
 * Directive for the main background map
 */
export class MainMapDirective extends LeafletMapComponent implements AfterViewInit, OnDestroy {

    /**
     * Layer for the stop markers to be displayed on the map
     */
    private stopMarkerLayer: L.FeatureGroup<L.Marker> = undefined;
    /**
     * Layer for the vehicle markers to be displayed on the map
     */
    private vehicleMarkerLayer: L.FeatureGroup = undefined;
    /**
     * Subscription for the update cycle for the vehicles
     */
    private vehicleUpdateSubscription: Subscription;
    /**
     * Handles display and requesting of routes being displayed on the main map
     */
    private mainMapRouteDisplay: MainMapRouteDisplayHandler;
    /**
     * Constructor
     * @param elRef injected elementRef of the component root
     * @param apiService ApiService instance
     * @param router Router Instance
     * @param stopService Stop Service Instance for retrievel of stops
     * @param userLocationService UserLocationService Instance
     * @param location Browser Location
     * @param snackBar SnackbarService Instance
     * @param settings Settings Service
     * @param zone ngZone Instance
     */
    constructor(elRef: ElementRef,
        private apiService: ApiService,
        private router: Router,
        private stopService: StopPointService,
        userLocationService: UserLocationService,
        private location: Location,
        private snackBar: MatSnackBar,
        settings: SettingsService,
        private vehicleSerivce: VehicleService,
        zone: NgZone) {
        super(elRef, zone, userLocationService, settings);
    }

    /**
     * Replaces all current vehicles on the map
     * @param vehicles vehicles to be displayed
     */
    public setVehicles(vehicles: IVehicleLocationList): void {
        if (this.vehicleMarkerLayer !== undefined) {
            this.vehicleMarkerLayer.clearLayers();
        } else {
            this.vehicleMarkerLayer = L.featureGroup();
            this.vehicleMarkerLayer.addTo(this.getMap());
            this.vehicleMarkerLayer.on('click', this.vehicleMarkerEventHandler.bind(this));
            this.vehicleMarkerLayer.on('mouseover', this.vehicleMarkerEventHandler.bind(this));
            this.vehicleMarkerLayer.on('mouseout', this.vehicleMarkerEventHandler.bind(this));
        }
        if (vehicles && Array.isArray(vehicles.vehicles)) {
            for (const veh of vehicles.vehicles) {
                if (veh.isDeleted === true) {
                    continue;
                }
                const newMarker: L.Marker<any> = this.addVehicleMarker(veh as IVehicleLocation);
                if (newMarker) {
                    newMarker.addTo(this.vehicleMarkerLayer);
                }
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
                        this.snackBar.open('No location acquired yet!',
                            undefined,
                            {
                                duration: 2000,
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
        this.mainMapRouteDisplay = new MainMapRouteDisplayHandler(this.getMap(), this.apiService);
        this.mainMapRouteDisplay.start();
    }

    /**
     * Does start the vehicle location update cycle
     */
    public startVehicleUpdater(): void {
        // as mapMove doesn't emit on init this needs to be provided to load atleast once
        this.vehicleSerivce.getVehicles
            .subscribe(new VehicleLoadSubscriber(this));
    }

    /**
     * Triggered by marker clicks on stops and returns the event into the ngZone
     * @param event mouse event
     */
    public onClickMarker(event: L.LeafletEvent & { sourceTarget: { data: ITripPassages } }) {
        // needs to be taken back into the ng zone
        this.zone.run(() => {
            this.router.navigate(['passages', event.sourceTarget.data.tripId]);
        });
    }
    public vehicleMarkerEventHandler(event: L.LeafletMouseEvent & { sourceTarget: { data: ITripPassages } }) {
        // needs to be taken back into the ng zone
        this.zone.run(() => {
            switch (event.type) {
                case 'mouseover':
                case 'mouseout':
                    this.onMouseOverEvent(event);
                    break;
                case 'click':
                    this.onClickMarker(event);
                    break;

            }
        });
    }

    /**
     * Triggered by moving the mouse over the marker and returns the event into the ngZone
     * @param event mouse event
     */
    public onMouseOverEvent(event: L.LeafletMouseEvent & { sourceTarget: { data: ITripPassages } }) {
        const mouseOver: boolean = (event.type === 'mouseover');
        this.mainMapRouteDisplay.setMouseHovering(mouseOver, mouseOver ? event.sourceTarget.data.tripId : undefined);
    }

    /**
     * Adds a vehicle marker to the map
     * @param vehicle Vehicle to be added
     */
    public addVehicleMarker(vehicle: IVehicleLocation): L.Marker {
        if (vehicle.latitude === undefined || vehicle.longitude === undefined) {
            // tslint:disable-next-line:no-console
            // console.log('Vehicle has no known location:', vehicle);
            return;
        }
        const vehicleIcon: L.DivIcon = createVehicleIcon(vehicle.heading, vehicle.name.split(' ')[0], 40);
        const markerT: any = L.marker([vehicle.latitude / 3600000, vehicle.longitude / 3600000], {
            icon: vehicleIcon,
            rotationAngle: vehicle.heading - 90,
            title: vehicle.name,
            zIndexOffset: 100,
        } as any);
        markerT.data = vehicle;
        return markerT;
    }

    /**
     * Does add all stop location markers to the map
     */
    public addMarker() {
        if (this.stopMarkerLayer !== undefined) {
            this.stopMarkerLayer.clearLayers();
        } else {
            this.stopMarkerLayer = L.featureGroup();
            this.stopMarkerLayer.addTo(this.getMap());
            this.stopMarkerLayer.on('click', this.stopMarkerOnClick.bind(this));
        }
        combineLatest(this.leafletZoomLevel, this.leafletBounds)
            .pipe(debounceTime(200),
                startWith([]),
                flatMap((data: [number, L.LatLngBounds]): Observable<StopMarkers[]> => {
                    if (data[0] > 14) {
                        return this.stopService.stopPointObservable
                            .pipe(map((stops: IStopPointLocation[]): IStopPointLocation[] => {
                                return stops.filter((stop: IStopPointLocation): boolean => {
                                    if (data[1])
                                        return data[1].contains([stop.latitude / 3600000, stop.longitude / 3600000]);
                                    return true;
                                })
                            }), map((stops: IStopPointLocation[]): StopMarkers[] => {
                                const markers: StopMarkers[] = [];
                                for (let stop of stops) {
                                    const greenIcon = createStopIcon(this.location);
                                    const markerT: StopMarkers = L.marker([stop.latitude / 3600000, stop.longitude / 3600000],
                                        {
                                            icon: greenIcon,
                                            interactive: true,
                                            riseOffset: 10,
                                            riseOnHover: true,
                                            title: stop.name,
                                            zIndexOffset: 10,
                                        });
                                    markerT.stopPoint = stop;
                                    markers.push(markerT);
                                }
                                return markers;
                            }));
                    } else {
                        return this.stopService.stopObservable
                            .pipe(map((stops: IStopLocation[]): IStopLocation[] => {
                                return stops.filter((stop) => {
                                    if (data[1])
                                        return data[1].contains([stop.latitude / 3600000, stop.longitude / 3600000]);
                                    return true;
                                })
                            }), map((stops: IStopLocation[]): StopMarkers[] => {
                                const markers: L.Marker[] = [];
                                for (let stop of stops) {
                                    const greenIcon = createStopIcon(this.location);
                                    const markerT: StopMarkers = L.marker([stop.latitude / 3600000, stop.longitude / 3600000],
                                        {
                                            icon: greenIcon,
                                            interactive: true,
                                            riseOffset: 10,
                                            riseOnHover: true,
                                            title: stop.name,
                                            zIndexOffset: 10,
                                        });
                                    markerT.stop = stop;
                                    markers.push(markerT);
                                }
                                return markers;
                            }));
                    }
                }))
            .subscribe((markers: StopMarkers[]) => {
                console.log("Markers", markers.length);
                this.stopMarkerLayer.clearLayers();
                for (let marker of markers) {
                    marker.addTo(this.stopMarkerLayer);
                }
            });
    }

    /**
     * Triggered by stop marker clicks
     * @param event click event
     */
    public stopMarkerOnClick(event: { sourceTarget: StopMarkers }) {
        // needs to be taken back into the ng zone
        this.zone.run(() => {
            if (event.sourceTarget.stopPoint) {
                this.router.navigate(['stopPoint', event.sourceTarget.stopPoint.shortName]);
            } else if (event.sourceTarget.stop) {
                this.router.navigate(['stop', event.sourceTarget.stop.shortName]);
            }
        });
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.vehicleUpdateSubscription) {
            this.vehicleUpdateSubscription.unsubscribe();
        }
        this.mainMapRouteDisplay.stop();
    }

}

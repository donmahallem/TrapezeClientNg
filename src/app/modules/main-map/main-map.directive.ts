import { Location } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, NgZone, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import {
    ITripPassages,
} from '@donmahallem/trapeze-api-types';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';
import { SettingsService } from 'src/app/services/settings.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { LeafletMapComponent } from '../../modules/common/leaflet-map.component';
import { StopPointService } from '../../services/stop-point.service';
import { UserLocationService } from '../../services/user-location.service';
import { ApiService } from './../../services';
import { MainMapRouteDisplayHandler } from './main-map-route-display-handler';
import { MarkerHandler, StopMarkers } from './marker-handler';
import { VehicleHandler } from './vehicle-handler';

@Directive({
    selector: 'map[appMainMap]',
})
/**
 * Directive for the main background map
 */
export class MainMapDirective extends LeafletMapComponent implements AfterViewInit, OnDestroy {

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
    private markerHandler: MarkerHandler;
    private vehicleHandler: VehicleHandler;
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
        this.markerHandler = new MarkerHandler(stopService, location, 14);
        this.vehicleHandler = new VehicleHandler(vehicleSerivce);
    }

    public ngAfterViewInit() {
        super.ngAfterViewInit();
        this.markerHandler.start(this.getMap());
        this.markerHandler.getClickObservable()
            .subscribe((marker: StopMarkers): void => {

                this.zone.run(() => {
                    if (marker.stopPoint) {
                        this.router.navigate(['stopPoint', marker.stopPoint.shortName]);
                    } else if (marker.stop) {
                        this.router.navigate(['stop', marker.stop.shortName]);
                    }
                });
            });
        this.vehicleHandler.start(this.getMap());
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
    public ngOnDestroy(): void {
        this.markerHandler.stop();
        this.vehicleHandler.stop();
        super.ngOnDestroy();
        if (this.vehicleUpdateSubscription) {
            this.vehicleUpdateSubscription.unsubscribe();
        }
        this.mainMapRouteDisplay.stop();
    }

}

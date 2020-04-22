import { Location } from '@angular/common';
import { Directive, ElementRef, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';
import { SettingsService } from 'src/app/services/settings.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { StopPointService } from '../../services/stop-point.service';
import { InteractiveLeafletMapComponent } from '../common/interactive-leaflet-map.component';
import { ApiService } from './../../services';
import { MarkerHandler } from './marker-handler';
import { VehicleHandler } from './vehicle-handler';

@Directive({
    selector: 'map[appMainMap]',
})
/**
 * Directive for the main background map
 */
export class MainMapDirective extends InteractiveLeafletMapComponent implements OnDestroy {

    /**
     * Subscription for the update cycle for the vehicles
     */
    private vehicleUpdateSubscription: Subscription;
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
                public apiService: ApiService,
                public router: Router,
                public stopService: StopPointService,
                public location: Location,
                settings: SettingsService,
                public vehicleSerivce: VehicleService,
                zone: NgZone) {
        super(elRef, zone, settings);
        this.markerHandler = new MarkerHandler(this, 15);
        this.vehicleHandler = new VehicleHandler(this);
        /* this.markerHandler.start();
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
         this.vehicleHandler.start();*/
    }
    public onBeforeSetView(map: L.Map): void {
        super.onBeforeSetView(map);
        this.markerHandler.start(map);
        this.vehicleHandler.start(map);
    }

    public ngOnDestroy(): void {
        this.markerHandler.stop();
        this.vehicleHandler.stop();
        super.ngOnDestroy();
        if (this.vehicleUpdateSubscription) {
            this.vehicleUpdateSubscription.unsubscribe();
        }
    }

}

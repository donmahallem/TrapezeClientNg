import { Location } from '@angular/common';
import { Directive, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';
import { SettingsService } from 'src/app/services/settings.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { StopPointService } from '../../services/stop-point.service';
import { OlMapComponent } from '../common/openlayers';
import { ApiService } from './../../services';
import { MarkerHandler } from './marker-handler';
import { VehicleHandler } from './vehicle-handler';

@Directive({
    selector: 'map[appOlMainMap]',
})
/**
 * Directive for the main background map
 */
export class OlMainMapDirective extends OlMapComponent {

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
        console.log('YIS');
    }

    public ngAfterViewInit(): void {
        console.log('KKKK');
        super.ngAfterViewInit();
    }
    public onBeforeSetView(map: L.Map): void {
        this.markerHandler.start(map);
        this.vehicleHandler.start(map);
    }

    public ngOnDestroy(): void {
        this.markerHandler.stop();
        this.vehicleHandler.stop();
        if (this.vehicleUpdateSubscription) {
            this.vehicleUpdateSubscription.unsubscribe();
        }
    }

}

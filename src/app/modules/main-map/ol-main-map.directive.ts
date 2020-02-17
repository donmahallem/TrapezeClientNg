import { Location } from '@angular/common';
import { Directive, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { StyleFunction } from 'leaflet';
import { Map as OLMap } from 'ol';
import * as OlCondition from 'ol/events/condition';
import { Select } from 'ol/interaction';
import Style, { StyleLike } from 'ol/style/Style';
import { FeatureLike } from 'ol/Feature';
import { Subscription } from 'rxjs';
import { SettingsService } from 'src/app/services/settings.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { StopPointService } from '../../services/stop-point.service';
import { OlMapComponent, OlUtil } from '../common/openlayers';
import { ApiService } from './../../services';
import { OlMarkerHandler } from './ol-marker-handler';
import { OlVehicleHandler } from './ol-vehicle-handler';
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
    private markerHandler: OlMarkerHandler;
    private vehicleHandler: OlVehicleHandler;
    public readonly mapSelectInteraction: Select;
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
        this.markerHandler = new OlMarkerHandler(this, 15);
        this.vehicleHandler = new OlVehicleHandler(this);
        this.mapSelectInteraction = new Select({
            condition: OlCondition.click,
            multi: false,
            style: (p0: FeatureLike, p1: number): Style | Style[] => {
                switch (p0.get('type')) {
                    case 'vehicle':
                        return OlUtil.createVehicleMarkerStyle(true)(p0, p1);
                    case 'stop':
                    case 'stopPoint':
                        return OlUtil.createStopMarkerStyle(true);

                    default:
                        return undefined;
                }
            },
            toggleCondition: OlCondition.never,
        });
    }

    public onAfterSetView(map: OLMap): void {

        this.markerHandler.start(map);
        this.vehicleHandler.start(map);
        this.getMap().addInteraction(this.mapSelectInteraction);
        // vectorLayer.addEventListener('click', () => { console.log(arguments); return true; });
        // map.addLayer(vectorLayer);
        // map.addInteraction(selectClick);
    }

    public ngOnDestroy(): void {
        this.markerHandler.stop();
        this.vehicleHandler.stop();
        if (this.vehicleUpdateSubscription) {
            this.vehicleUpdateSubscription.unsubscribe();
        }
    }

}

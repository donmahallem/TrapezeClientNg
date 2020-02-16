import { Location } from '@angular/common';
import { Directive, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Feature, Map as OLMap } from 'ol';
import { click } from 'ol/events/condition';
import Point from 'ol/geom/Point';
import { Select } from 'ol/interaction';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Icon from 'ol/style/Icon';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import { Subscription } from 'rxjs';
import { SettingsService } from 'src/app/services/settings.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { StopPointService } from '../../services/stop-point.service';
import { OlMapComponent } from '../common/openlayers';
import { ApiService } from './../../services';
import { MarkerHandler } from './marker-handler';
import { VehicleHandler } from './vehicle-handler';
const styles = {
    route: new Style({
        stroke: new Stroke({
            width: 6, color: [237, 212, 0, 0.8],
        }),
    }),
    icon: new Style({
        image: new Icon({
            anchor: [0.5, 0.5],
            // size: [32, 32],
            src: 'assets/stop-icon-24.svg',
            imgSize: [64, 64],
            scale: 0.5,
        }),
    }),
    geoMarker: new Style({
        image: new CircleStyle({
            radius: 7,
            fill: new Fill({ color: 'black' }),
            stroke: new Stroke({
                color: 'white', width: 2,
            }),
        }),
    }),
};
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

    public onAfterSetView(map: OLMap): void {
        const geoMarker = new Feature({
            type: 'geoMarker',
            geometry: new Point([0, 0]),
        });
        const startMarker = new Feature({
            type: 'icon',
            geometry: new Point([0, 10]),
        });
        const endMarker = new Feature({
            type: 'icon',
            geometry: new Point([10, 10]),
        });

        const vectorLayer = new VectorLayer({
            source: new VectorSource({
                features: [geoMarker, startMarker, endMarker],
            }),
            style(feature) {
                // hide geoMarker if animation is active
                if (feature.get('type') === 'geoMarker') {
                    return null;
                }
                return styles[feature.get('type')];
            },
        }); // select interaction working on "click"
        const selectClick = new Select({
            condition: click,
        });
        vectorLayer.addEventListener('click', () => { console.log(arguments); return true; });
        map.addLayer(vectorLayer);
        map.addInteraction(selectClick);
        console.log('la', map.getLayers());

        selectClick.on('select', (e) => {
            console.log('KKK', e);
        });
    }

    public ngOnDestroy(): void {
        this.markerHandler.stop();
        this.vehicleHandler.stop();
        if (this.vehicleUpdateSubscription) {
            this.vehicleUpdateSubscription.unsubscribe();
        }
    }

}

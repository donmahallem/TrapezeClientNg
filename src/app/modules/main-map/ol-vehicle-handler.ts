import { NgZone } from '@angular/core';
import { IVehicleLocation } from '@donmahallem/trapeze-api-types';
import { Feature, Map as OlMap } from 'ol';
import * as olCondition from 'ol/events/condition';
import Point from 'ol/geom/Point';
import { Select } from 'ol/interaction';
import { SelectEvent } from 'ol/interaction/Select';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import { combineLatest, from, fromEvent, of, Observable, Subscriber, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, flatMap, map, share, switchMap } from 'rxjs/operators';
import { LeafletUtil } from 'src/app/leaflet';
import { runOutsideZone } from 'src/app/rxjs-util/run-outside-zone';
import { IData, TimestampedVehicleLocation } from 'src/app/services/vehicle.service';
import { OlUtil } from '../common/openlayers';
import { MainMapDirective } from './main-map.directive';
import { OlMainMapDirective } from './ol-main-map.directive';
export type VehicleEvent = L.LeafletEvent & {
    sourceTarget: {
        vehicle?: TimestampedVehicleLocation;
    },
};
export type VehicleMarker = L.Marker & {
    vehicle?: TimestampedVehicleLocation;
    hovering?: boolean;
};
export class OlVehicleHandler {
    public readonly markerClickObservable: Observable<VehicleMarker>;

    /**
     * Layer for the stop markers to be displayed on the map
     */
    private vehicleMarkerLayer: VectorLayer;
    private vehicleMarkerVectorSource: VectorSource;

    private loadSubscription: Subscription;
    private mouseHoverSubscription: Subscription;
    public constructor(private mainMap: OlMainMapDirective) {
    }

    public start(leafletMap: OlMap): void {
        NgZone.assertNotInAngularZone();
        this.vehicleMarkerVectorSource = new VectorSource();
        this.vehicleMarkerLayer = new VectorLayer({
            source: this.vehicleMarkerVectorSource,
        });
        leafletMap.addLayer(this.vehicleMarkerLayer);
        const selectSingleClick: Select = new Select({
            condition: olCondition.singleClick,
            layers: [this.vehicleMarkerLayer],
            multi: false,
            style: OlUtil.createStyleByType('vehicle_selected'),
            toggleCondition: olCondition.never,
        });
        // leafletMap.addInteraction(selectSingleClick);
        this.loadSubscription =
            this.mainMap.vehicleSerivce
                .getVehicles
                .pipe(distinctUntilChanged((x: IData, y: IData): boolean => {
                    if (x && y) {
                        return x.lastUpdate === y.lastUpdate;
                    }
                    return false;
                }), map((dat: IData): TimestampedVehicleLocation[] =>
                    dat.vehicles), runOutsideZone(this.mainMap.zone))
                .subscribe((result: TimestampedVehicleLocation[]) => {
                    this.setVehicles(result);
                });
        selectSingleClick.on('select', (e: SelectEvent) => {
            if (e.selected.length > 0) {
                const selectedFeature: Feature = e.selected[0];
                switch (selectedFeature.get('type')) {
                    case 'vehicle':
                        this.onClickStopPoint(selectedFeature.get('vehicle'));
                        break;
                }
            }
        });
    }

    public onClickStopPoint(stopPoint: IVehicleLocation): void {
        NgZone.assertNotInAngularZone();
        this.mainMap.zone.run(() => {
            this.mainMap.router.navigate(['passages', stopPoint.tripId]);
        });
    }
    public setVehicles(stops: TimestampedVehicleLocation[]): void {
        NgZone.assertNotInAngularZone();
        if (this.vehicleMarkerVectorSource.getFeatures().length > 0) {
            this.vehicleMarkerVectorSource.clear(true);
        }
        const feats: Feature[] = stops.map((value: IVehicleLocation): Feature => {
            const coord: L.LatLng = LeafletUtil.convertCoordToLatLng(value);
            const endMarker: Feature = new Feature({
                geometry: new Point(fromLonLat([coord.lng, coord.lat])),
                type: 'vehicle',
                vehicle: value,
            });
            endMarker.setStyle(OlUtil.createStyleByFeature(endMarker));
            return endMarker;
        });
        this.vehicleMarkerVectorSource.addFeatures(feats);
        this.vehicleMarkerLayer.changed();
    }
    public stop(): void {
        if (this.loadSubscription) {
            this.loadSubscription.unsubscribe();
            this.loadSubscription = undefined;
        }
        if (this.mouseHoverSubscription) {
            this.mouseHoverSubscription.unsubscribe();
            this.mouseHoverSubscription = undefined;
        }
    }
}

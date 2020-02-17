import { NgZone } from '@angular/core';
import { IStopLocation, IStopPointLocation } from '@donmahallem/trapeze-api-types';
import { Map as OlMap } from 'ol';
import * as olCondition from 'ol/events/condition';
import Point from 'ol/geom/Point';
import { Select } from 'ol/interaction';
import { SelectEvent } from 'ol/interaction/Select';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat, getPointResolution } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { startWith, take } from 'rxjs/operators';
import { LeafletUtil } from 'src/app/leaflet';
import { OlUtil } from '../common/openlayers';
import { OlMainMapDirective } from './ol-main-map.directive';
export type StopMarkers = L.Marker & {
    stopPoint?: IStopPointLocation;
    stop?: IStopLocation;
};
export class OlMarkerHandler {

    /**
     * Layer for the stop markers to be displayed on the map
     */
    private stopMarkerLayer: VectorLayer = undefined;
    /**
     * Layer for the stop markers to be displayed on the map
     */
    private stopPointMarkerLayer: VectorLayer = undefined;
    private stopPointMarkerVectorSource: VectorSource = undefined;
    private stopMarkerVectorSource: VectorSource = undefined;
    private loadSubscription: Subscription;
    public constructor(private mainMap: OlMainMapDirective,
        private readonly zoomBorder: number) {
    }

    public getStopLocations(): Observable<IStopLocation[]> {
        return this.mainMap.stopService.stopObservable
            .pipe(take(1), startWith([]));
    }

    public getStopPointLocations(): Observable<IStopPointLocation[]> {
        return this.mainMap.stopService.stopPointObservable
            .pipe(take(1), startWith([]));
    }

    public start(leafletMap: OlMap): void {
        NgZone.assertNotInAngularZone();
        this.stopPointMarkerVectorSource = new VectorSource();
        this.stopMarkerVectorSource = new VectorSource({
            features: [],
        });
        const zoomBorder: number = leafletMap.getView().getResolutionForZoom(this.zoomBorder);
        this.stopMarkerLayer = new VectorLayer({
            minResolution: zoomBorder,
            source: this.stopMarkerVectorSource,
        });
        this.stopPointMarkerLayer = new VectorLayer({
            maxResolution: zoomBorder,
            source: this.stopPointMarkerVectorSource,
        });
        leafletMap.addLayer(this.stopMarkerLayer);
        leafletMap.addLayer(this.stopPointMarkerLayer);
        const selectSingleClick: Select = new Select({
            condition: olCondition.click,
            layers: [
                this.stopMarkerLayer,
                this.stopPointMarkerLayer,
            ],
            multi: false,
            style: OlUtil.createStyleByType('stop_selected'),
            toggleCondition: olCondition.never,
        });
        /*
        this.stopMarkerLayer.addEventListener('select', () => {
            console.log(arguments);
        });*/
        this.loadSubscription =
            combineLatest([this.getStopLocations(), this.getStopPointLocations()])
                .subscribe((result: [IStopLocation[], IStopPointLocation[]]) => {
                    this.setStopPoints(result[1]);
                    this.setStops(result[0]);
                });
        // leafletMap.addInteraction(selectSingleClick);
        selectSingleClick.on('select', (e: SelectEvent) => {
            if (e.selected.length > 0) {
                const selectedFeature: Feature = e.selected[0];
                switch (selectedFeature.get('type')) {
                    case 'stopPoint':
                        this.onClickStopPoint(selectedFeature.get('stopPoint'));
                        break;
                    case 'stop':
                        this.onClickStop(selectedFeature.get('stop'));
                        break;
                }
            }
        });
    }

    public onClickStopPoint(stopPoint: IStopPointLocation): void {
        NgZone.assertNotInAngularZone();
        this.mainMap.zone.run(() => {
            this.mainMap.router.navigate(['stopPoint', stopPoint.stopPoint]);
        });
    }

    public onClickStop(stop: IStopLocation): void {
        NgZone.assertNotInAngularZone();
        this.mainMap.zone.run(() => {
            this.mainMap.router.navigate(['stop', stop.shortName]);
        });
    }

    public setStopPoints(stopPoints: IStopPointLocation[]): void {
        NgZone.assertNotInAngularZone();
        if (this.stopPointMarkerVectorSource.getFeatures().length > 0) {
            this.stopPointMarkerVectorSource.clear(true);
        }
        const feats: Feature[] = stopPoints.map((value: IStopPointLocation): Feature => {
            const coord: L.LatLng = LeafletUtil.convertCoordToLatLng(value);
            const endMarker: Feature = new Feature({
                geometry: new Point(fromLonLat([coord.lng, coord.lat])),
                stopPoint: value,
                type: 'stopPoint',
            });
            endMarker.setStyle(OlUtil.createStyleByFeature(endMarker));
            return endMarker;
            // this.stopPointMarkerVectorSource.addFeature(endMarker);
        });
        this.stopPointMarkerVectorSource.addFeatures(feats);
        this.stopPointMarkerLayer.changed();
    }

    public setStops(stops: IStopLocation[]): void {
        NgZone.assertNotInAngularZone();
        if (this.stopMarkerVectorSource.getFeatures().length > 0) {
            this.stopMarkerVectorSource.clear(true);
        }
        const feats: Feature[] = stops.map((value: IStopLocation): Feature => {
            const coord: L.LatLng = LeafletUtil.convertCoordToLatLng(value);
            const endMarker: Feature = new Feature({
                geometry: new Point(fromLonLat([coord.lng, coord.lat])),
                stop: value,
                type: 'stop',
            });
            endMarker.setStyle(OlUtil.createStyleByFeature(endMarker));
            return endMarker;
        });
        this.stopMarkerVectorSource.addFeatures(feats);
        this.stopMarkerLayer.changed();
    }
    public stop(): void {
        if (this.loadSubscription) {
            this.loadSubscription.unsubscribe();
            this.loadSubscription = undefined;
        }
    }
}

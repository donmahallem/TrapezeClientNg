import { NgZone } from '@angular/core';
import { IStopLocation, IStopPointLocation } from '@donmahallem/trapeze-api-types';
import { Map as OlMap } from 'ol';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat } from 'ol/proj';
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
    private readonly stopMarkerLayer: VectorLayer = undefined;
    /**
     * Layer for the stop markers to be displayed on the map
     */
    private readonly stopPointMarkerLayer: VectorLayer = undefined;
    private readonly stopPointMarkerVectorSource: VectorSource = undefined;
    private readonly stopMarkerVectorSource: VectorSource = undefined;
    private loadSubscription: Subscription;
    private zoomSubscription: Subscription;
    private clickSubscription: Subscription;
    private clickObservable: Observable<StopMarkers>;
    public constructor(private mainMap: OlMainMapDirective,
                       private readonly zoomBorder: number) {
        this.stopPointMarkerVectorSource = new VectorSource();
        this.stopMarkerVectorSource = new VectorSource({
            features: [],
        });
        this.stopMarkerLayer = new VectorLayer({
            source: this.stopMarkerVectorSource,
            style: OlUtil.createStyles,
        });
        this.stopPointMarkerLayer = new VectorLayer({
            source: this.stopPointMarkerVectorSource,
            style: OlUtil.createStyles,
        });
    }

    public getClickObservable(): Observable<StopMarkers> {
        return this.clickObservable;
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
        leafletMap.addLayer(this.stopMarkerLayer);
        leafletMap.addLayer(this.stopPointMarkerLayer);
        /*
        this.zoomSubscription = this.mainMap
            .leafletZoomEvent
            .pipe(startWith(leafletMap.getView().getZoom()),
                observeOn(asapScheduler),
                runOutsideZone(this.mainMap.zone))
            .subscribe((zoomLevel: number) => {
                const showLayer: VectorLayer = (zoomLevel > this.zoomBorder) ?
                    this.stopPointMarkerLayer : this.stopMarkerLayer;
                const hideLayer: VectorLayer = (zoomLevel > this.zoomBorder) ?
                    this.stopMarkerLayer : this.stopPointMarkerLayer;
                hideLayer.setVisible(false);
                showLayer.setVisible(true);
            });
        this.clickSubscription = this.clickObservable
            .pipe(runInZone(this.mainMap.zone))
            .subscribe((marker: StopMarkers): void => {
                if (marker.stopPoint) {
                    this.mainMap.router.navigate(['stopPoint', marker.stopPoint.stopPoint]);
                } else if (marker.stop) {
                    this.mainMap.router.navigate(['stop', marker.stop.shortName]);
                }
            });*/
        this.loadSubscription =
            combineLatest([this.getStopLocations(), this.getStopPointLocations()])
                .subscribe((result: [IStopLocation[], IStopPointLocation[]]) => {
                    this.setStopPoints(result[1]);
                    this.setStops(result[0]);
                });
    }

    public setStopPoints(stopPoints: IStopPointLocation[]): void {
        NgZone.assertNotInAngularZone();
        // this.stopPointMarkerLayer.
        console.log('stopPoints', stopPoints.length);
        stopPoints.forEach((value: IStopPointLocation): void => {
            const coord: L.LatLng = LeafletUtil.convertCoordToLatLng(value);
            const endMarker: Feature = new Feature({
                geometry: new Point([coord.lng, coord.lat]),
                type: 'icon',
            });
            // this.stopPointMarkerVectorSource.addFeature(endMarker);
        });
        this.stopPointMarkerLayer.changed();
        this.stopMarkerLayer.changed();
    }

    public setStops(stops: IStopLocation[]): void {
        NgZone.assertNotInAngularZone();
        console.log('stops', stops.length);
        const feats: Feature[] = stops.map((value: IStopLocation): Feature => {
            const coord: L.LatLng = LeafletUtil.convertCoordToLatLng(value);
            const endMarker = new Feature({
                type: 'icon',
                geometry: new Point(fromLonLat([coord.lng, coord.lat])), // [value.longitude, value.latitude]),

            });
            return endMarker;
        });
        this.stopMarkerVectorSource.addFeatures(feats);
        this.stopPointMarkerLayer.changed();
        this.stopMarkerLayer.changed();
    }
    public stop(): void {
        if (this.loadSubscription) {
            this.loadSubscription.unsubscribe();
            this.loadSubscription = undefined;
        }
        if (this.zoomSubscription) {
            this.zoomSubscription.unsubscribe();
            this.zoomSubscription = undefined;
        }
        if (this.clickSubscription) {
            this.clickSubscription.unsubscribe();
            this.clickSubscription = undefined;
        }
    }
}

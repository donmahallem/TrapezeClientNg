import { NgZone } from '@angular/core';
import { IStopLocation, IStopPointLocation } from '@donmahallem/trapeze-api-types';
import * as L from 'leaflet';
import { combineLatest, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { filter, map, share, startWith, take } from 'rxjs/operators';
import { createStopIcon, LeafletUtil } from 'src/app/leaflet';
import { runInZone } from 'src/app/rxjs-util';
import { MainMapDirective } from './main-map.directive';
export type StopMarkers = L.Marker & {
    stopPoint?: IStopPointLocation;
    stop?: IStopLocation;
};
export class MarkerHandler {

    /**
     * Layer for the stop markers to be displayed on the map
     */
    private readonly stopMarkerLayer: L.FeatureGroup<StopMarkers> = undefined;
    /**
     * Layer for the stop markers to be displayed on the map
     */
    private readonly stopPointMarkerLayer: L.FeatureGroup<StopMarkers> = undefined;

    private loadSubscription: Subscription;
    private zoomSubscription: Subscription;
    private clickSubscription: Subscription;
    private clickObservable: Observable<StopMarkers>;
    public constructor(private mainMap: MainMapDirective,
                       private readonly zoomBorder: number) {
        this.stopMarkerLayer = L.featureGroup();
        this.stopPointMarkerLayer = L.featureGroup();

        this.clickObservable = merge(fromEvent(this.stopMarkerLayer, 'click'),
            fromEvent(this.stopPointMarkerLayer, 'click'))
            .pipe(filter((evt: L.LeafletEvent): boolean =>
                (evt && evt.sourceTarget && (evt.sourceTarget.stop || evt.sourceTarget.stopPoint))),
                map((evt: L.LeafletEvent): StopMarkers =>
                    evt.sourceTarget), share());
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

    public start(leafletMap: L.Map): void {
        this.zoomSubscription = this.mainMap
            .leafletZoomEvent
            .pipe(startWith(leafletMap.getZoom()))
            .subscribe((zoomLevel: number) => {
                const showLayer: L.FeatureGroup = (zoomLevel > this.zoomBorder) ?
                    this.stopPointMarkerLayer : this.stopMarkerLayer;
                const hideLayer: L.FeatureGroup = (zoomLevel > this.zoomBorder) ?
                    this.stopMarkerLayer : this.stopPointMarkerLayer;
                if (leafletMap.hasLayer(hideLayer)) {
                    leafletMap.removeLayer(hideLayer);
                }
                if (!leafletMap.hasLayer(showLayer)) {
                    showLayer.addTo(leafletMap);
                }
            });
        this.loadSubscription =
            combineLatest([this.getStopLocations(), this.getStopPointLocations()])
                .subscribe((result: [IStopLocation[], IStopPointLocation[]]) => {
                    this.setStopPoints(result[1]);
                    this.setStops(result[0]);
                });
        this.clickSubscription = this.clickObservable
            .pipe(runInZone(this.mainMap.zone))
            .subscribe((marker: StopMarkers): void => {
                if (marker.stopPoint) {
                    this.mainMap.router.navigate(['stopPoint', marker.stopPoint.stopPoint]);
                } else if (marker.stop) {
                    this.mainMap.router.navigate(['stop', marker.stop.shortName]);
                }
            });
    }

    public setStopPoints(stopPoints: IStopPointLocation[]): void {
        NgZone.assertNotInAngularZone();
        this.stopPointMarkerLayer.clearLayers();
        stopPoints.forEach((value: IStopPointLocation): void => {
            const greenIcon: L.Icon<L.IconOptions> = createStopIcon(this.mainMap.location);
            const coord: L.LatLng = LeafletUtil.convertCoordToLatLng(value);
            const markerT: StopMarkers = L.marker(coord,
                {
                    icon: greenIcon,
                    interactive: true,
                    riseOffset: 10,
                    riseOnHover: true,
                    title: value.name,
                    zIndexOffset: 10,
                });
            markerT.stopPoint = value;
            markerT.addTo(this.stopPointMarkerLayer);
        });
    }

    public setStops(stops: IStopLocation[]): void {
        NgZone.assertNotInAngularZone();
        this.stopMarkerLayer.clearLayers();
        stops.forEach((value: IStopLocation): void => {
            const greenIcon: L.Icon<L.IconOptions> = createStopIcon(this.mainMap.location);
            const coord: L.LatLng = LeafletUtil.convertCoordToLatLng(value);
            const markerT: StopMarkers = L.marker(coord,
                {
                    icon: greenIcon,
                    interactive: true,
                    riseOffset: 10,
                    riseOnHover: true,
                    title: value.name,
                    zIndexOffset: 10,
                });
            markerT.stop = value;
            markerT.addTo(this.stopMarkerLayer);
        });
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

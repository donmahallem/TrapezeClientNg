import { Location } from '@angular/common';
import { IStopLocation, IStopPointLocation } from '@donmahallem/trapeze-api-types';
import * as L from 'leaflet';
import { combineLatest, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { debounceTime, filter, map, share, startWith, take } from 'rxjs/operators';
import { createStopIcon } from 'src/app/leaflet';
import { StopPointService } from 'src/app/services';
export type StopMarkers = L.Marker & {
    stopPoint?: IStopPointLocation;
    stop?: IStopLocation;
};
export class MarkerHandler {

    /**
     * Layer for the stop markers to be displayed on the map
     */
    private stopMarkerLayer: L.FeatureGroup<StopMarkers> = undefined;
    /**
     * Layer for the stop markers to be displayed on the map
     */
    private stopPointMarkerLayer: L.FeatureGroup<StopMarkers> = undefined;

    private isSetup = false;
    private loadSubscription: Subscription;
    private zoomSubscription: Subscription;
    private clickObservable: Observable<StopMarkers>;
    public constructor(private stopService: StopPointService,
                       private location: Location,
                       private readonly zoomBorder: number) {
        this.stopMarkerLayer = L.featureGroup();
        this.stopPointMarkerLayer = L.featureGroup();
        this.clickObservable = merge(fromEvent(this.stopMarkerLayer, 'click'),
            fromEvent(this.stopPointMarkerLayer, 'click'))
            .pipe(filter((evt: L.LeafletEvent): boolean =>
                (evt && evt.sourceTarget && (evt.sourceTarget.stop || evt.sourceTarget.stopPoint))), map((evt: L.LeafletEvent): StopMarkers =>
                evt.sourceTarget), share());
    }

    public getClickObservable(): Observable<StopMarkers> {
        return this.clickObservable;
    }

    public getStopLocations(): Observable<IStopLocation[]> {
        return this.stopService.stopObservable
            .pipe(take(1), startWith([]));
    }

    public getStopPointLocations(): Observable<IStopPointLocation[]> {
        return this.stopService.stopPointObservable
            .pipe(take(1), startWith([]));
    }

    public start(leafletMap: L.Map): void {
        if (this.isSetup) {
            throw new Error('Already setup');
        }
        this.isSetup = true;
        if (leafletMap.getZoom() > this.zoomBorder) {
            this.stopPointMarkerLayer.addTo(leafletMap);
        } else {
            this.stopMarkerLayer.addTo(leafletMap);
        }
        this.zoomSubscription = fromEvent(leafletMap, 'zoom')
            .pipe(map((evt: L.LeafletEvent): number =>
                evt.sourceTarget.getZoom()))
            .subscribe((zoomLevel: number) => {
                if (zoomLevel > 14) {
                    if (leafletMap.hasLayer(this.stopMarkerLayer)) {
                        leafletMap.removeLayer(this.stopMarkerLayer);
                    }
                    if (!leafletMap.hasLayer(this.stopPointMarkerLayer)) {
                        this.stopPointMarkerLayer.addTo(leafletMap);
                    }
                } else {
                    if (leafletMap.hasLayer(this.stopPointMarkerLayer)) {
                        leafletMap.removeLayer(this.stopPointMarkerLayer);
                    }
                    if (!leafletMap.hasLayer(this.stopMarkerLayer)) {
                        this.stopMarkerLayer.addTo(leafletMap);
                    }
                }
            });
        combineLatest(this.getStopLocations(), this.getStopPointLocations())
            .pipe(debounceTime(200))
            .subscribe((result: [IStopLocation[], IStopPointLocation[]]) => {
                this.setStopPoints(result[1]);
                this.setStops(result[0]);
            });
    }

    public setStopPoints(stopPoints: IStopPointLocation[]): void {
        this.stopPointMarkerLayer.clearLayers();
        stopPoints.forEach((value: IStopPointLocation): void => {
            const greenIcon: L.Icon<L.IconOptions> = createStopIcon(this.location);
            const markerT: StopMarkers = L.marker([value.latitude / 3600000, value.longitude / 3600000],
                {
                    icon: greenIcon,
                    interactive: true,
                    riseOffset: 10,
                    riseOnHover: true,
                    title: stop.name,
                    zIndexOffset: 10,
                });
            markerT.stopPoint = value;
            markerT.addTo(this.stopPointMarkerLayer);
        });
    }

    public setStops(stops: IStopLocation[]): void {
        this.stopMarkerLayer.clearLayers();
        stops.forEach((value: IStopLocation): void => {
            const greenIcon: L.Icon<L.IconOptions> = createStopIcon(this.location);
            const markerT: StopMarkers = L.marker([value.latitude / 3600000, value.longitude / 3600000],
                {
                    icon: greenIcon,
                    interactive: true,
                    riseOffset: 10,
                    riseOnHover: true,
                    title: stop.name,
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
    }
}

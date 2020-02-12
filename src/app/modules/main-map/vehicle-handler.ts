import * as L from 'leaflet';
import { combineLatest, from, fromEvent, Observable, Subscriber, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, flatMap, map, share, switchMap } from 'rxjs/operators';
import { createVehicleIcon, LeafletUtil, RouteDisplayHandler } from 'src/app/leaflet';
import { IData, TimestampedVehicleLocation } from 'src/app/services/vehicle.service';
import { MainMapDirective } from './main-map.directive';
export type VehicleEvent = L.LeafletEvent & {
    sourceTarget: {
        vehicle?: TimestampedVehicleLocation;
    },
};
export type VehicleMarker = L.Marker & {
    vehicle?: TimestampedVehicleLocation;
    hovering?: boolean;
};
export class VehicleHandler {
    public readonly markerClickObservable: Observable<VehicleMarker>;

    /**
     * Layer for the stop markers to be displayed on the map
     */
    private vehicleMarkerLayer: L.FeatureGroup<VehicleMarker> = undefined;

    private loadSubscription: Subscription;
    private mouseActionObservable: Observable<VehicleEvent>;
    private markerHoverObservable: Observable<VehicleMarker>;
    private mouseHoverSubscription: Subscription;
    private routeDisplayHandler: RouteDisplayHandler;
    public constructor(private mainMap: MainMapDirective) {
        this.vehicleMarkerLayer = L.featureGroup();
        const mouseEvents: string[] = ['click', 'mouseover', 'mouseout'];

        this.mouseActionObservable = from(mouseEvents)
            .pipe(flatMap((evtName: string): Observable<L.LeafletEvent> =>
                fromEvent(this.vehicleMarkerLayer, evtName)), filter((evt: L.LeafletEvent): boolean =>
                    (evt && evt.sourceTarget && evt.sourceTarget.vehicle)), share());
        this.markerClickObservable =
            this.mouseActionObservable
                .pipe(filter((evt: VehicleEvent): boolean =>
                    evt.type === 'click'), map((evt: VehicleEvent): VehicleMarker =>
                        evt.sourceTarget));
        this.markerHoverObservable =
            this.mouseActionObservable
                .pipe(filter((evt: VehicleEvent): boolean =>
                    evt.type === 'mouseover' || evt.type === 'mouseout'), map((evt: VehicleEvent): VehicleMarker => {
                        const marker = evt.sourceTarget;
                        marker.hovering = evt.type === 'mouseover';
                        return marker;
                    }));
    }

    /**
     * Adds a vehicle marker to the map
     * @param vehicle Vehicle to be added
     */
    public createVehicleMarker(vehicle: TimestampedVehicleLocation): VehicleMarker {
        if (vehicle.latitude === undefined || vehicle.longitude === undefined) {
            // tslint:disable-next-line:no-console
            // console.log('Vehicle has no known location:', vehicle);
            return;
        }
        const vehicleIcon: L.DivIcon = createVehicleIcon(vehicle.heading, vehicle.name.split(' ')[0], 40);
        const markerT: VehicleMarker = L.marker(LeafletUtil.convertCoordToLatLng(vehicle), {
            icon: vehicleIcon,
            rotationAngle: vehicle.heading - 90,
            title: vehicle.name,
            zIndexOffset: 100,
        } as any);
        markerT.vehicle = vehicle;
        return markerT;
    }

    public start(leafletMap: L.Map): void {
        this.vehicleMarkerLayer.addTo(leafletMap);
        this.routeDisplayHandler = new RouteDisplayHandler(leafletMap);
        const mapMoveEvent: Observable<L.LatLngBounds> = this.mainMap.leafletBoundsEvent
            .pipe(debounceTime(100));
        const vehicleObservable: Observable<TimestampedVehicleLocation[]> =
            this.mainMap.vehicleSerivce
                .getVehicles
                .pipe(distinctUntilChanged((x: IData, y: IData): boolean => {
                    if (x && y) {
                        return x.lastUpdate === y.lastUpdate;
                    }
                    return false;
                }), map((dat: IData): TimestampedVehicleLocation[] =>
                    dat.vehicles));
        const filteredVehicles: Observable<TimestampedVehicleLocation[]> =
            combineLatest([mapMoveEvent, vehicleObservable])
                .pipe(
                    map((result: [L.LatLngBounds, TimestampedVehicleLocation[]]): TimestampedVehicleLocation[] =>
                        result[1]
                            .filter((veh: TimestampedVehicleLocation): boolean => {
                                const coord: L.LatLng = LeafletUtil.convertCoordToLatLng(veh);
                                return result[0].contains(coord);
                            })));
        filteredVehicles
            .subscribe((result: TimestampedVehicleLocation[]) => {
                this.setVehicles(result);
            });
        /**
         * Mouse Hover Subscription for fade out
         */
        this.mouseHoverSubscription = this.markerHoverObservable
            .subscribe((currentMarker: VehicleMarker) => {
                this.vehicleMarkerLayer
                    .eachLayer((layer: VehicleMarker): void => {
                        layer.setOpacity((currentMarker.hovering && currentMarker !== layer) ? 0.25 : 1);
                    });

            });
        this.markerHoverObservable
            .pipe(switchMap((currentMaker: VehicleMarker): Observable<any> => {
                if (currentMaker.hovering) {
                    return this.mainMap.apiService.getRouteByTripId(currentMaker.vehicle.tripId)
                        .pipe(catchError(() => from([undefined])));
                } else {
                    return from([undefined]);
                }
            }))
            .subscribe(new Subscriber((value: any) => {
                if (value) {
                    if (value.paths && value.paths.length > 0) {
                        this.routeDisplayHandler.setRoutePaths(value.paths);
                        return;
                    }
                }
                this.routeDisplayHandler.clear();
            }));
    }

    public setVehicles(stops: TimestampedVehicleLocation[]): void {
        this.vehicleMarkerLayer.clearLayers();
        stops.forEach((value: TimestampedVehicleLocation): void => {
            const vehicleMarker: VehicleMarker = this.createVehicleMarker(value);
            vehicleMarker.addTo(this.vehicleMarkerLayer);
        });
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

import * as L from 'leaflet';
import { combineLatest, from, fromEvent, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, flatMap, map, mergeMap, share } from 'rxjs/operators';
import { createVehicleIcon, LeafletUtil } from 'src/app/leaflet';
import { Data, TimestampedVehicleLocation, VehicleService } from 'src/app/services/vehicle.service';
export type VehicleMarker = L.Marker & {
    vehicle?: TimestampedVehicleLocation;
};
export class VehicleHandler {

    /**
     * Layer for the stop markers to be displayed on the map
     */
    private vehicleMarkerLayer: L.FeatureGroup<VehicleMarker> = undefined;

    private isSetup = false;
    private loadSubscription: Subscription;
    private zoomSubscription: Subscription;
    private clickObservable: Observable<VehicleMarker>;
    public constructor(private vehicleSerivce: VehicleService) {
        this.vehicleMarkerLayer = L.featureGroup();
        const mouseEvents: string[] = ['click', 'mouseover', 'mouseout'];

        this.clickObservable = from(mouseEvents)
            .pipe(flatMap((evtName: string): Observable<L.LeafletEvent> =>
                fromEvent(this.vehicleMarkerLayer, evtName)), filter((evt: L.LeafletEvent): boolean =>
                (evt && evt.sourceTarget && evt.sourceTarget.vehicle)), map((evt: L.LeafletEvent): VehicleMarker =>
                evt.sourceTarget), share());
    }

    public getClickObservable(): Observable<VehicleMarker> {
        return this.clickObservable;
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
        if (this.isSetup) {
            throw new Error('Already setup');
        }
        this.isSetup = true;
        this.vehicleMarkerLayer.addTo(leafletMap);
        const eventTriggers: string[] = ['zoom', 'move', 'zoomend', 'moveend'];
        const mapMoveEvent: Observable<L.LatLngBounds> = from(eventTriggers)
            .pipe(mergeMap((eventName: string): Observable<L.LeafletEvent> =>
                fromEvent(leafletMap, eventName)), map((evt: L.LeafletEvent): L.LatLngBounds =>
                leafletMap.getBounds()), debounceTime(100));
        const vehicleObservable: Observable<TimestampedVehicleLocation[]> = this.vehicleSerivce
            .getVehicles
            .pipe(distinctUntilChanged((x: Data, y: Data): boolean => {
                if (x && y) {
                    return x.lastUpdate === y.lastUpdate;
                }
                return false;
            }), map((dat: Data): TimestampedVehicleLocation[] =>
                dat.vehicles));
        combineLatest(mapMoveEvent, vehicleObservable)
            .pipe(
                map((result: [L.LatLngBounds, TimestampedVehicleLocation[]]): TimestampedVehicleLocation[] =>
                    result[1]
                        .filter((veh: TimestampedVehicleLocation): boolean => {
                            const coord: L.LatLng = LeafletUtil.convertCoordToLatLng(veh);
                            return result[0].contains(coord);
                        })))
            .subscribe((result: TimestampedVehicleLocation[]) => {
                this.setVehicles(result);
            });
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
        if (this.zoomSubscription) {
            this.zoomSubscription.unsubscribe();
            this.zoomSubscription = undefined;
        }
    }
}

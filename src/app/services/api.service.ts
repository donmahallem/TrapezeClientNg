import {
    ISettings,
    IStopInfo,
    IStopLocations,
    IStopPassage,
    IStopPointLocations,
    ITripPassages,
    IVehicleLocation,
    IVehicleLocationList,
    IVehiclePathInfo,
    StopId,
    StopPointId,
    TripId,
    VehicleId,
} from '@donmahallem/trapeze-api-types';
import { Observable } from 'rxjs';
export abstract class ApiService {

    abstract baseUrl(): string ;

    abstract getTripPassages(tripId: TripId): Observable<ITripPassages> ;
    abstract getRouteByVehicleId(vehicleId: VehicleId): Observable<IVehiclePathInfo> ;
    abstract getRouteByTripId(tripId: TripId): Observable<IVehiclePathInfo> ;
    abstract getStopInfo(stopId: StopId): Observable<IStopInfo> ;
    abstract getStopPassages(stopId: StopId): Observable<IStopPassage>;
    abstract getStopPointPassages(stopPointId: StopPointId): Observable<IStopPassage>;
    abstract getVehicleLocations(lastUpdate: number ): Observable<IVehicleLocationList> ;
    abstract getVehicleLocation(vehicleId: VehicleId, lastUpdate: number): Observable<IVehicleLocation>;
    abstract  getStopLocations(bounds?: L.LatLngBounds): Observable<IStopLocations>;
    abstract getStopPointLocations(bounds?: L.LatLngBounds): Observable<IStopPointLocations>;
    abstract  getSettings(): Observable<ISettings>;
}

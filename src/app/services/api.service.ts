import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    ISettings,
    IStopInfo,
    IStopLocations,
    IStopPassage,
    IVehicleLocation,
    IVehicleLocationList,
    IVehiclePathInfo,
    StopId,
    TripId,
    VehicleId,
} from '@donmahallem/trapeze-api-types';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { TripPassagesLocation } from '../models';
import { IMapBounds } from '../modules/common/leaflet-map.component';
@Injectable({
    providedIn: 'root',
})
export class ApiService {

    constructor(private http: HttpClient) { }

    public baseUrl(): string {
        return environment.apiEndpoint.endsWith('\/') ? environment.apiEndpoint : (environment.apiEndpoint + '\/');
    }

    public getTripPassages(tripId: TripId): Observable<TripPassagesLocation> {
        return this.http.get<TripPassagesLocation>(this.baseUrl() + 'trip/' + tripId + '/passages?mode=departure');
    }
    public getRouteByVehicleId(vehicleId: VehicleId): Observable<IVehiclePathInfo> {
        return this.http.get<IVehiclePathInfo>(this.baseUrl() + 'vehicle/' + vehicleId + '/route');
    }
    public getRouteByTripId(tripId: TripId): Observable<IVehiclePathInfo> {
        return this.http.get<IVehiclePathInfo>(this.baseUrl() + 'trip/' + tripId + '/route');
    }
    public getStopInfo(stopId: StopId): Observable<IStopInfo> {
        return this.http.get<IStopInfo>(this.baseUrl() + 'stop/' + stopId + '/info');
    }
    public getStopPassages(stopId: StopId): Observable<IStopPassage> {
        return this.http.get<IStopPassage>(this.baseUrl() + 'stop/' + stopId + '/departures');
    }
    public getVehicleLocations(bounds: IMapBounds): Observable<IVehicleLocationList> {
        return this.http.get<IVehicleLocationList>(this.baseUrl() + 'geo/vehicles', {
            params: {
                bottom: '' + Math.round(bounds.bottom * 3600000),
                left: '' + Math.round(bounds.left * 3600000),
                right: '' + Math.round(bounds.right * 3600000),
                top: '' + Math.round(bounds.top * 3600000),
            },
        });
    }
    public getVehicleLocation(vehicleId: VehicleId): Observable<IVehicleLocation> {
        return this.http.get<IVehicleLocation>(this.baseUrl() + 'geo/vehicle/' + vehicleId);
    }

    public getStations(): Observable<IStopLocations> {
        return this.http.get<IStopLocations>(this.baseUrl() + 'geo/stops');
    }

    public getSettings(): Observable<ISettings> {
        return this.http.get<ISettings>(this.baseUrl() + 'settings');
    }
}

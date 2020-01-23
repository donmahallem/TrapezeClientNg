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
    ITripPassages
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

    public getTripPassages(tripId: TripId): Observable<ITripPassages> {
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
        return this.http.get<IStopPassage>(this.baseUrl() + 'stop/' + stopId + '/passages');
    }
    public getVehicleLocations(lastUpdate: number = 0): Observable<IVehicleLocationList> {
        return this.http.get<IVehicleLocationList>(this.baseUrl() + 'geo/vehicles', {
            params: {
                lastUpdate: "" + lastUpdate
            },
        });
    }
    public getVehicleLocation(vehicleId: VehicleId, lastUpdate: number = 0): Observable<IVehicleLocation> {
        return this.http.get<IVehicleLocation>(this.baseUrl() + 'geo/vehicle/' + vehicleId, {
            params: {
                "lastUpdate": "" + lastUpdate
            }
        });
    }

    public getStations(bounds?: IMapBounds): Observable<IStopLocations> {
        if (bounds) {
            return this.http.get<IStopLocations>(this.baseUrl() + 'geo/stops', {
                params: {
                    bottom: '' + Math.round(bounds.bottom * 3600000),
                    left: '' + Math.round(bounds.left * 3600000),
                    right: '' + Math.round(bounds.right * 3600000),
                    top: '' + Math.round(bounds.top * 3600000),
                },
            });
        }
        return this.http.get<IStopLocations>(this.baseUrl() +
            'geo/stops?left=-648000000&bottom=-324000000&right=648000000&top=324000000');
    }

    public getSettings(): Observable<ISettings> {
        return this.http.get<ISettings>(this.baseUrl() + 'settings');
    }
}

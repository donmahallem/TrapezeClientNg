import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IStopInfo, IStopPassage, IVehicleLocation, IVehicleLocationList } from '@donmahallem/trapeze-api-types';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { StationsResponse } from '../models/stations-response.model';
import { IMapBounds } from '../modules/common/leaflet-map.component';
@Injectable({
    providedIn: 'root',
})
export class ApiService {

    constructor(private http: HttpClient) { }

    public baseUrl(): string {
        return environment.apiEndpoint.endsWith('\/') ? environment.apiEndpoint : (environment.apiEndpoint + '\/');
    }

    public getTripPassages(tripId: string): Observable<any> {
        return this.http.get(this.baseUrl() + 'api/trip/' + tripId + '/passages?mode=departure');
    }
    public getRouteByVehicleId(vehicleId: string): Observable<any> {
        return this.http.get(this.baseUrl() + 'api/vehicle/' + vehicleId + '/route');
    }
    public getRouteByTripId(vehicleId: string): Observable<any> {
        return this.http.get(this.baseUrl() + 'api/trip/' + vehicleId + '/route');
    }
    public getStopInfo(vehicleId: string | number): Observable<IStopInfo> {
        return this.http.get<IStopInfo>(this.baseUrl() + 'api/stop/' + vehicleId + '/info');
    }
    public getStopPassages(vehicleId: string | number): Observable<IStopPassage> {
        return this.http.get<IStopPassage>(this.baseUrl() + 'api/stop/' + vehicleId + '/departures');
    }
    public getVehicleLocations(bounds: IMapBounds): Observable<IVehicleLocationList> {
        return this.http.get<IVehicleLocationList>(this.baseUrl() + 'api/geo/vehicles', {
            params: {
                bottom: '' + Math.round(bounds.bottom * 3600000),
                left: '' + Math.round(bounds.left * 3600000),
                right: '' + Math.round(bounds.right * 3600000),
                top: '' + Math.round(bounds.top * 3600000),
            },
        });
    }
    public getVehicleLocation(vehicleId: string): Observable<IVehicleLocation> {
        return this.http.get<IVehicleLocation>(this.baseUrl() + 'api/geo/vehicle/' + vehicleId);
    }

    public getStations(): Observable<StationsResponse> {
        return this.http.get<StationsResponse>(this.baseUrl() + 'api/geo/stops');
    }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IStopInfo } from '@donmahallem/trapeze-api-types';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { StationsResponse } from '../models/stations-response.model';
import { Bounds } from './../models';
@Injectable({
    providedIn: 'root',
})
export class ApiService {

    constructor(private http: HttpClient) { }

    public getTripPassages(tripId: string): Observable<any> {
        return this.http.get(environment.apiBaseUrl + 'api/trip/' + tripId + '/passages?mode=departure');
    }
    public getRouteByVehicleId(vehicleId: string): Observable<any> {
        return this.http.get(environment.apiBaseUrl + 'api/vehicle/' + vehicleId + '/route');
    }
    public getRouteByTripId(vehicleId: string): Observable<any> {
        return this.http.get(environment.apiBaseUrl + 'api/trip/' + vehicleId + '/route');
    }
    public getStopInfo(vehicleId: string | number): Observable<any> {
        return this.http.get(environment.apiBaseUrl + 'api/stop/' + vehicleId + '/info');
    }
    public getStopDepartures(vehicleId: string | number): Observable<IStopInfo> {
        return this.http.get<IStopInfo>(environment.apiBaseUrl + 'api/stop/' + vehicleId + '/departures');
    }
    public getVehicleLocations(bounds: Bounds): Observable<any> {
        return this.http.get(environment.apiBaseUrl + 'api/geo/vehicles', {
            params: {
                bottom: '' + Math.round(bounds.bottom * 3600000),
                left: '' + Math.round(bounds.left * 3600000),
                right: '' + Math.round(bounds.right * 3600000),
                top: '' + Math.round(bounds.top * 3600000),
            },
        });
    }
    public getVehicleLocation(vehicleId: string): Observable<any> {
        return this.http.get(environment.apiBaseUrl + 'api/geo/vehicle/' + vehicleId);
    }

    public getStations(): Observable<StationsResponse> {
        return this.http.get<StationsResponse>(environment.apiBaseUrl + 'api/geo/stations');
    }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IStopInfo } from '@donmahallem/trapeze-api-types';
import { Observable } from 'rxjs';
import { StationsResponse } from '../models/stations-response.model';
import { Bounds } from './../models';
import { ConfigService } from './config.service';
@Injectable({
    providedIn: 'root',
})
export class ApiService {

    constructor(private http: HttpClient,
        private configService: ConfigService) { }

    public getTripPassages(tripId: string): Observable<any> {
        return this.http.get(this.configService.apiEndpoint + 'api/trip/' + tripId + '/passages?mode=departure');
    }
    public getRouteByVehicleId(vehicleId: string): Observable<any> {
        return this.http.get(this.configService.apiEndpoint + 'api/vehicle/' + vehicleId + '/route');
    }
    public getRouteByTripId(vehicleId: string): Observable<any> {
        return this.http.get(this.configService.apiEndpoint + 'api/trip/' + vehicleId + '/route');
    }
    public getStopInfo(vehicleId: string | number): Observable<any> {
        return this.http.get(this.configService.apiEndpoint + 'api/stop/' + vehicleId + '/info');
    }
    public getStopDepartures(vehicleId: string | number): Observable<IStopInfo> {
        return this.http.get<IStopInfo>(this.configService.apiEndpoint + 'api/stop/' + vehicleId + '/departures');
    }
    public getVehicleLocations(bounds: Bounds): Observable<any> {
        return this.http.get(this.configService.apiEndpoint + 'api/geo/vehicles', {
            params: {
                bottom: '' + Math.round(bounds.bottom * 3600000),
                left: '' + Math.round(bounds.left * 3600000),
                right: '' + Math.round(bounds.right * 3600000),
                top: '' + Math.round(bounds.top * 3600000),
            },
        });
    }
    public getVehicleLocation(vehicleId: string): Observable<any> {
        return this.http.get(this.configService.apiEndpoint + 'api/geo/vehicle/' + vehicleId);
    }

    public getStations(): Observable<StationsResponse> {
        return this.http.get<StationsResponse>(this.configService.apiEndpoint + 'api/geo/stations');
    }
}

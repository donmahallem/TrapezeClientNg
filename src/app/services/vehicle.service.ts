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
    VehicleLocations,
} from '@donmahallem/trapeze-api-types';
import { Observable, BehaviorSubject, timer, interval, concat, from } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { TripPassagesLocation } from '../models';
import { IMapBounds } from '../modules/common/leaflet-map.component';
import { ApiService } from './api.service';
import { map, flatMap, tap, debounce, debounceTime, shareReplay } from 'rxjs/operators';

export type TimestampedVehicleLocation = IVehicleLocation & {
    lastUpdate: number,
}
export interface Data {
    lastUpdate: number,
    vehicles: TimestampedVehicleLocation[],
}
@Injectable({
    providedIn: 'root',
})
export class VehicleService {
    private state: BehaviorSubject<Data> = new BehaviorSubject({ lastUpdate: 0, vehicles: [] });
    constructor(private api: ApiService) {
        concat(from([0]),
            this.state.pipe(debounceTime(2000), map((value) => value.lastUpdate)))
            .pipe(flatMap((time: number) => {
                console.log(time);
                return this.api.getVehicleLocations(time);
            }), map((value): Data => {
                return {
                    lastUpdate: value.lastUpdate,
                    vehicles: value.vehicles
                        .filter((veh: any): boolean => {
                            if (veh.isDeleted === true)
                                return false;
                            if (veh.latitude && veh.longitude)
                                return true;
                            return false;
                        })
                        .map((veh: IVehicleLocation): TimestampedVehicleLocation => {
                            return Object.assign({
                                lastUpdate: value.lastUpdate
                            }, veh);
                        })
                };
            }))
            .subscribe((data) => {
                this.state.next(data);
            });
    }

    public get obs(): Observable<Data> {
        return this.state;
    }
}

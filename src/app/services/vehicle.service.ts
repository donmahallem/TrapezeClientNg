import { Injectable } from '@angular/core';
import {
    IVehicleLocation,
    VehicleLocations,
} from '@donmahallem/trapeze-api-types';
import { concat, from, of, BehaviorSubject, Observable } from 'rxjs';
import { catchError, debounceTime, flatMap, map } from 'rxjs/operators';
import { ApiService } from './api.service';

export type TimestampedVehicleLocation = IVehicleLocation & {
    lastUpdate: number,
};
export type TimestampedVehicles = VehicleLocations & {
    lastUpdate: number,
};
export interface Data {
    error?: any;
    lastUpdate: number;
    vehicles: TimestampedVehicleLocation[];
}
type VehicleMap = Map<string, TimestampedVehicles>;
@Injectable({
    providedIn: 'root',
})
export class VehicleService {
    private state: BehaviorSubject<Data> = new BehaviorSubject({ lastUpdate: 0, vehicles: [] });
    constructor(private api: ApiService) {
        const startValue: Data = {
            lastUpdate: 0,
            vehicles: [],
        };
        concat(from([startValue]), this.state.pipe(debounceTime(10000)))
            .pipe(flatMap((previousData: Data) =>
                this.api.getVehicleLocations(previousData.lastUpdate)
                    .pipe(map((value): Data => {/*
                        if(previousData.lastUpdate!==value.lastUpdate){
                            console.log("New location data acquired",value.lastUpdate)
                        }*/
                        const timestampedNewLocations: TimestampedVehicles[] =
                            value.vehicles
                                .map((veh: IVehicleLocation): TimestampedVehicles =>
                                    Object.assign({
                                        lastUpdate: value.lastUpdate,
                                    }, veh));
                        const reducedVehicles: VehicleMap =
                            timestampedNewLocations.concat(previousData.vehicles)
                                .reduce((prev: VehicleMap, cur: TimestampedVehicles): VehicleMap => {
                                    if (prev.has(cur.id) && prev.get(cur.id).lastUpdate >= cur.lastUpdate) {
                                        return prev;
                                    }
                                    prev.set(cur.id, cur);
                                    return prev;
                                }, new Map());
                        const filterInvalid: TimestampedVehicleLocation[] =
                            Array.from(reducedVehicles.values())
                                .filter((value: any): boolean => {
                                    if (value) {
                                        if (value.isDeleted === true) {
                                            return false;
                                        }
                                        if (value.latitude && value.longitude) {
                                            return true;
                                        }
                                    }
                                    return false;
                                }) as any;
                        return {
                            lastUpdate: value.lastUpdate,
                            vehicles: filterInvalid,
                        };
                    }), catchError((err) =>
                        of(Object.assign({
                            error: err,
                        }, previousData))))))
            .subscribe((data) => {
                this.state.next(data);
            });
    }

    public get getVehicles(): Observable<Data> {
        return this.state;
    }

}

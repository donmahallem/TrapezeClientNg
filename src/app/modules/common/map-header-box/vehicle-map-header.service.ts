import { Injectable } from '@angular/core';
import { IStopLocation, IStopPassage, IVehiclePathInfo } from '@donmahallem/trapeze-api-types';
import { of, BehaviorSubject, Observable } from 'rxjs';
import { catchError, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ApiService, TripInfoWithId } from 'src/app/services';
import { TimestampedVehicleLocation, VehicleService } from 'src/app/services/vehicle.service';

export interface IStatus {
    lastUpdate: Date;
    location?: IStopLocation;
    stop: IStopPassage;
}
@Injectable()
export class VehicleMapHeaderService {
    public readonly statusObservable: Observable<IStatus>;
    public readonly tripInfoSubject: BehaviorSubject<TripInfoWithId> = new BehaviorSubject(undefined);
    constructor(public vehicleService: VehicleService,
                public apiService: ApiService) {
    }

    public createVehicleLocationObservable(): Observable<TimestampedVehicleLocation> {
        return this.pollVehicleLocation(this.tripInfoSubject);
    }
    public createVehicleRouteObservable(): Observable<IVehiclePathInfo> {
        return this.pollVehicleRoute(this.tripInfoSubject);
    }
    public pollVehicleLocation(source: Observable<TripInfoWithId>): Observable<TimestampedVehicleLocation> {
        return source.pipe(switchMap((trip: TripInfoWithId): Observable<TimestampedVehicleLocation> => {
            if (trip) {
                return this.vehicleService
                    .getVehicleByTripId(trip.tripId);
            } else {
                return of(undefined);
            }
        }), distinctUntilChanged((x: TimestampedVehicleLocation, y: TimestampedVehicleLocation) => {
            if (x && y) {
                return x.lastUpdate === y.lastUpdate;
            }
            return false;
        }));
    }

    public pollVehicleRoute(source: Observable<TripInfoWithId>): Observable<IVehiclePathInfo> {
        return source.pipe(switchMap((trip: TripInfoWithId): Observable<IVehiclePathInfo> => {
            if (trip) {
                return this.apiService
                    .getRouteByTripId(trip.tripId)
                    .pipe(catchError((err: any): Observable<undefined> =>
                        of(undefined)));
            }
            return of(undefined);
        }));
    }

}

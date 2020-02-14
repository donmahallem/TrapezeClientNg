import { Injectable } from '@angular/core';
import { IStopLocation, IStopPassage, IVehicleLocation, IVehiclePathInfo } from '@donmahallem/trapeze-api-types';
import { of, BehaviorSubject, Observable } from 'rxjs';
import { catchError, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { LeafletUtil } from 'src/app/leaflet';
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

    public pollVehicleLocation(source: Observable<TripInfoWithId>): Observable<L.LatLng> {
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
        }), map((loc: IVehicleLocation): L.LatLng =>
            loc ? LeafletUtil.convertCoordToLatLng(loc) : undefined));
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

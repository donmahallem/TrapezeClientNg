import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ITripPassages, ITripRoute, IVehicleLocation } from '@donmahallem/trapeze-api-types';
import * as L from 'leaflet';
import { of, BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { LeafletUtil } from 'src/app/leaflet';
import { ApiService, TripInfoWithId } from 'src/app/services';
import { TimestampedVehicleLocation, VehicleService } from 'src/app/services/vehicle.service';
import { MapHeaderComponent } from './map-header.component';

export interface IVehicleInfo {
    speed: number;
    location: L.LatLng;
    route?: ITripRoute;
}
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-vehicle-map-header',
    styleUrls: ['./map-header.component.scss'],
    templateUrl: './vehicle-map-header.component.pug',
})
export class VehicleMapHeaderBoxComponent extends MapHeaderComponent {

    @Input()
    public set tripInfo(trip: TripInfoWithId) {
        // this.tripSubject.next(trip);
    }

    public get tripInfo(): TripInfoWithId {
        return this.tripSubject.getValue();
    }

    public get title(): string {
        if (this.tripInfo) {
            return this.tripInfo.routeName + ' - ' + this.tripInfo.directionText;
        }
        return undefined;
    }
    public readonly tripObservable: Observable<ITripPassages>;
    public readonly vehicleLocationObservable: Observable<IVehicleInfo>;
    private readonly tripSubject: BehaviorSubject<ITripPassages>;
    public constructor(public vehicleService: VehicleService,
                       public apiService: ApiService) {
        super();
        this.tripSubject = new BehaviorSubject(undefined);
        this.tripObservable = this.tripSubject.asObservable()
            .pipe(distinctUntilChanged((x: ITripPassages, y: ITripPassages): boolean => {
                if (x && y) {
                    return x.tripId === y.tripId;
                }
                return false;
            }));
    }

    public watchVehicle(source: Observable<TripInfoWithId>): Observable<L.LatLng> {
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
}

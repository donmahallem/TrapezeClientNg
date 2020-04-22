import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ITripPassages, ITripRoute } from '@donmahallem/trapeze-api-types';
import * as L from 'leaflet';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService, TripInfoWithId } from 'src/app/services';
import { VehicleService } from 'src/app/services/vehicle.service';
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
        /*
        this.tripObservable = this.tripSubject.asObservable()
            .pipe(distinctUntilChanged((x: ITripPassages, y: ITripPassages): boolean => {
                if (x && y) {
                    return x.tripId === y.tripId;
                }
                return false;
            }));
        this.vehicleLocationObservable = this.tripObservable
            .pipe(tap(() => {
                this.lastUpdate = new Date();
            }), switchMap((trip: ITripPassages): Observable<any> => {
                if (trip) {
                    return this.vehicleService
                        .getVehicleByTripId(trip.tripId)
                        .pipe(catchError((err: any): Observable<void> =>
                            EMPTY));
                } else {
                    return of(undefined);
                }
            }),
                // needed for pairwise not delaying the display
                startWith(undefined as TimestampedVehicleLocation),
                pairwise(),
                map((val: [TimestampedVehicleLocation, TimestampedVehicleLocation]): IVehicleInfo => {
                    if (val[0] && val[1]) {
                        const loc1: L.LatLng = LeafletUtil.convertCoordToLatLng(val[1]);
                        const loc2: L.LatLng = LeafletUtil.convertCoordToLatLng(val[0]);
                        const dst: number = loc1.distanceTo(loc2) / 1000;
                        const tDst: number = val[1].lastUpdate - val[0].lastUpdate;
                        const vehicleSpeed: number = tDst > 0 ? (dst / tDst / 3600) : -1;
                        return {
                            location: LeafletUtil.convertCoordToLatLng(val[1]),
                            speed: vehicleSpeed,
                        };
                    }
                    return {
                        location: val[1] ? LeafletUtil.convertCoordToLatLng(val[1]) : L.latLng(0, 0),
                        speed: -1,
                    };
                }));*/
    }

}

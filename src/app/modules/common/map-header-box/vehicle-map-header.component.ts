import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ITripPassages, IVehicleLocation, ITripRoute } from '@donmahallem/trapeze-api-types';
import { of, BehaviorSubject, Observable, EMPTY } from 'rxjs';
import { distinctUntilChanged, map, pairwise, switchMap, tap, startWith, catchError } from 'rxjs/operators';
import { LeafletUtil } from 'src/app/leaflet';
import { ApiService } from 'src/app/services';
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
    public set tripPassages(trip: ITripPassages) {
        this.tripSubject.next(trip);
    }

    public get tripPassages(): ITripPassages {
        return this.tripSubject.getValue();
    }

    public get title(): string {
        if (this.tripPassages) {
            return this.tripPassages.routeName + ' - ' + this.tripPassages.directionText;
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
        this.vehicleLocationObservable = this.tripObservable
            .pipe(tap(() => {
                this.lastUpdate = new Date();
            }), switchMap((trip: ITripPassages): Observable<any> => {
                if (trip) {
                    return this.vehicleService
                        .getVehicleByTripId(trip.tripId)
                        .pipe(catchError((err: any): Observable<void> => {
                            return EMPTY;
                        }))
                } else {
                    return of(undefined);
                }
            }),
                // needed for pairwise not delaying the display
                startWith(undefined),
                pairwise(),
                map((val: [TimestampedVehicleLocation, TimestampedVehicleLocation]): IVehicleInfo => {
                    if (val[0] && val[1]) {
                        const loc1: L.LatLng = LeafletUtil.convertCoordToLatLng(val[1]);
                        const loc2: L.LatLng = LeafletUtil.convertCoordToLatLng(val[0]);
                        const dst: number = loc1.distanceTo(loc2) / 1000;
                        const tDst: number = val[1].lastUpdate - val[0].lastUpdate;
                        const vehicleSpeed: number = tDst > 0 ? (dst / tDst / 3600) : -1;
                        return {
                            speed: vehicleSpeed,
                            location: LeafletUtil.convertCoordToLatLng(val[1])
                        };
                    }
                    return {
                        speed: -1,
                        location: LeafletUtil.convertCoordToLatLng(val[1])
                    };
                }));
    }

}

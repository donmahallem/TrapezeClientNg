import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IActualTripPassage, ITripPassages, TripId } from '@donmahallem/trapeze-api-types';
import { combineLatest, from, merge, BehaviorSubject, Observable, Subscriber, Subscription } from 'rxjs';
import { catchError, debounceTime, flatMap, map } from 'rxjs/operators';
import { Data, TimestampedVehicleLocation, VehicleService } from 'src/app/services/vehicle.service';
import { ApiService } from '../../services';

export enum UpdateStatus {
    LOADING = 1,
    LOADED = 2,
    ERROR = 3,
    PAUSED = 4,
    UNKNOWN = 5,
    NOT_FOUND = 404,
    SERVER_ERROR = 500,
}

export interface IPassageStatus {
    status: UpdateStatus;
    passages?: ITripPassages;
    timestamp: number;
    location?: TimestampedVehicleLocation;
    failures?: number;
    tripId: TripId;
}
/**
 * Component displaying the TripPassages for a Trip
 */
@Component({
    selector: 'app-trip-passages',
    styleUrls: ['./trip-passages.component.scss'],
    templateUrl: './trip-passages.component.pug',
})
export class TripPassagesComponent implements AfterViewInit, OnDestroy {

    /**
     * Returns the TripPassages
     * @returns undefined or {@link TripPassagesLocation}
     */
    public get tripPassage(): ITripPassages {
        if (this.statusSubject.value) {
            return this.statusSubject.value.passages;
        }
        return undefined;
    }

    public get tripLocation(): TimestampedVehicleLocation {
        if (this.statusSubject.value) {
            return this.statusSubject.value.location;
        }
        return undefined;
    }

    /**
     * Returns the last timestamp when data was tried to be retrieved
     * @returns number or 0 if no timestamp is set
     */
    public get lastTimestamp(): number {
        if (this.statusSubject.value) {
            return this.statusSubject.value.timestamp;
        }
        return 0;
    }

    /**
     * Returns the current set update status or {@link UpdateStatus.LOADING}
     * @returns the {@link UpdateStatus}
     */
    public get statusCode(): UpdateStatus {
        if (this.statusSubject.value) {
            return this.statusSubject.value.status;
        }
        return UpdateStatus.LOADING;
    }

    public get status(): IPassageStatus {
        if (this.statusSubject.value) {
            return this.statusSubject.value;
        }
        return undefined;
    }

    /**
     * returns the current tripID
     */
    public get tripId(): TripId {
        return this.route.snapshot.params.tripId as TripId;
    }

    /**
     * short hand to retrieve route name
     */
    public get routeName(): string {
        return (this.tripPassage) ? this.tripPassage.routeName : '';
    }

    /**
     * List of passages
     */
    public get tripPassages(): IActualTripPassage[] {
        return (this.tripPassage !== undefined) ? this.tripPassage.actual : [];
    }

    public get hasLocation(): boolean {
        if (this.status && this.status.location) {
            return true;
        }
        return false;
    }
    public readonly DEBOUNCE_TIME: number = 5000;
    public readonly STATUS_OPS: typeof UpdateStatus = UpdateStatus;
    private statusSubject: BehaviorSubject<IPassageStatus> = new BehaviorSubject(undefined);
    private snapshotDataSubscription: Subscription;
    private pollSubscription: Subscription;
    constructor(private route: ActivatedRoute,
                private apiService: ApiService,
                private router: Router,
                private vehicleService: VehicleService) {
    }

    /**
     * Returns if an error has happened during the last update
     * @returns true if an error occured
     */
    public hasError(): boolean {
        return this.statusCode === UpdateStatus.ERROR;
    }

    /**
     * Initializes the update observable
     */
    public ngAfterViewInit(): void {
        const poll0 = this.statusSubject.pipe(debounceTime(this.DEBOUNCE_TIME),
            flatMap((status: IPassageStatus): Observable<IPassageStatus> =>
                this.apiService
                    .getTripPassages(status.tripId)
                    .pipe(map((resp) =>
                        this.convertResponse(status.tripId, resp)),
                    catchError(this.handleError.bind(this)))));
        const poll1 = merge(this.route.data.pipe(map((data) => data.tripPassages)), poll0);
        const poll2 = this.vehicleService.getVehicles;
        this.pollSubscription = combineLatest(poll1, poll2)
            .pipe(map((trip: [IPassageStatus, Data]): any => {
                const matchedVehicles: any[] = trip[1].vehicles
                    .filter((val) =>
                        val.tripId === trip[0].tripId);
                const a = Object.assign({
                    location: matchedVehicles.length > 0 ? matchedVehicles[0] : undefined,
                }, trip[0]);
                return a;
            }),
                catchError(this.handleError.bind(this)))
            .subscribe(new Subscriber((val: IPassageStatus) => {
                if (val.tripId === this.tripId) {
                    this.statusSubject.next(val);
                } else {
                    // trigger so a reload can execute
                    this.statusSubject.next(this.statusSubject.value);
                }
            }));
    }
    /**
     * destroys created update observables
     */
    public ngOnDestroy(): void {
        if (this.snapshotDataSubscription) {
            this.snapshotDataSubscription.unsubscribe();
        }
        if (this.pollSubscription) {
            this.pollSubscription.unsubscribe();
        }
    }

    public convertResponse(tripId: TripId, tripPassages: ITripPassages): IPassageStatus {
        return {
        passages: tripPassages,
        status: UpdateStatus.LOADED,
        timestamp: Date.now(),
        tripId,
        failures: 0,
    };
}
    public handleError(err?: any): Observable<any> {
        let status: UpdateStatus = UpdateStatus.ERROR;
        if (err.status) {
            // Http Error
            const statusCode: number = err.status;
            if (statusCode === 404) {
                status = UpdateStatus.NOT_FOUND;
                this.router.navigate(['not-found'], {
                    queryParams: {
                        type: 'passages',
                    },
                });
            } else if (statusCode >= 500 && statusCode < 600) {
                status = UpdateStatus.SERVER_ERROR;
            }
        }
        const returnValue: IPassageStatus = Object.assign({}, this.statusSubject.value);
        returnValue.status = status;
        if (returnValue.failures) {
            returnValue.failures += 1;
        } else {
            returnValue.failures = 1;
        }
        return from([returnValue]);
    }

}

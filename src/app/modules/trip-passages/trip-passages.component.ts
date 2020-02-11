import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IActualTripPassage, ITripPassages, TripId } from '@donmahallem/trapeze-api-types';
import { combineLatest, from, merge, BehaviorSubject, Observable, Subscriber, Subscription, pipe, of } from 'rxjs';
import { catchError, debounceTime, flatMap, map, switchMap, tap, delay, scan } from 'rxjs/operators';
import { Data, TimestampedVehicleLocation, VehicleService } from 'src/app/services/vehicle.service';
import { ApiService } from '../../services';
import {
    UpdateStatus,
    IPassageStatus,
    TripPassagesUtil
} from './trip-util';

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

    public readonly STATUS_OPS: typeof UpdateStatus = UpdateStatus;
    private readonly statusSubject: BehaviorSubject<IPassageStatus>;
    public readonly statusObservable: Observable<IPassageStatus>;
    private pollSubscription: Subscription;
    constructor(private route: ActivatedRoute,
        private apiService: ApiService) {
        this.statusSubject = new BehaviorSubject(route.snapshot.data.tripPassages);
        const refreshObservable: Observable<IPassageStatus> = this.createRefreshPollObservable();
        this.statusObservable = merge(this.route.data.pipe(map((data) => data.tripPassages)), refreshObservable)
            .pipe(scan((acc: IPassageStatus, val: IPassageStatus, idx: number): IPassageStatus => {
                if (acc) {
                    val.failures = val.failures > 0 ? acc.failures + val.failures : 0;
                }
                return val;
            }),
                tap((newStatus: IPassageStatus): void => this.statusSubject.next(newStatus)));;
    }


    public createRefreshPollObservable(): Observable<IPassageStatus> {
        return this.statusSubject.pipe(
            switchMap((status: IPassageStatus): Observable<IPassageStatus> => {
                const refreshDelay: number = (status.status === UpdateStatus.LOADED) ?
                    10000 :
                    20000;
                return of(undefined)
                    .pipe(delay(refreshDelay),
                        flatMap((): Observable<ITripPassages> => this.apiService.getTripPassages(status.tripId)),
                        TripPassagesUtil.convertResponse(status.tripId),
                        TripPassagesUtil.handleError(status.tripId))
            }));
    }
    /**
     * Initializes the update observable
     */
    public ngAfterViewInit(): void {
        this.statusObservable.subscribe(new Subscriber((val: IPassageStatus) => {
            console.log("RES", val);
        }));
    }
    /**
     * destroys created update observables
     */
    public ngOnDestroy(): void {
        if (this.pollSubscription) {
            this.pollSubscription.unsubscribe();
        }
    }

}

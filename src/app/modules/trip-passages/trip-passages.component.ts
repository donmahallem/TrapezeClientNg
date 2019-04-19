import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IActualTripPassage, TripId, ITripPassages } from '@donmahallem/trapeze-api-types';
import { combineLatest, timer, BehaviorSubject, Observable, Subscriber, Subscription, NEVER, EMPTY, of, merge } from 'rxjs';
import { catchError, filter, map, mergeMap, retry, retryWhen, tap, delay, throttleTime, flatMap, single, debounceTime } from 'rxjs/operators';
import { TripPassagesLocation } from 'src/app/models';
import { ApiService } from '../../services';

enum UpdateStatus {
    LOADING = 1,
    ERROR = 2,
    LOADED = 3,
    PAUSED = 4,
    NOT_FOUND = 5,
    SERVER_ERROR = 6
}

export interface IPassageStatus {
    status: UpdateStatus,
    passages: TripPassagesLocation,
    timestamp: number;
}

@Component({
    selector: 'app-trip-passages',
    styleUrls: ['./trip-passages.component.scss'],
    templateUrl: './trip-passages.component.pug',
})
export class TripPassagesComponent implements AfterViewInit, OnDestroy {
    private updateObservable: Subscription;
    private status: BehaviorSubject<IPassageStatus> = new BehaviorSubject(undefined);
    private snapshotDataSubscription: Subscription;
    public readonly StatusOps: typeof UpdateStatus = UpdateStatus;
    constructor(private route: ActivatedRoute, private apiService: ApiService) {
        this.snapshotDataSubscription = this.route.data.subscribe((data) => {
            this.status.next({
                status: UpdateStatus.LOADED,
                passages: data['tripPassages'],
                timestamp: Date.now()
            })
        });
    }

    public get updateStatus(): UpdateStatus {
        if (this.status.value)
            return this.status.value.status;
        return UpdateStatus.LOADING;
    }

    public get tripData(): TripPassagesLocation {
        if (this.status.value) {
            return this.status.value.passages;
        }
        return undefined;
    }

    /**
     * returns the current tripID
     */
    public get tripId(): TripId {
        return this.route.snapshot.params.tripId;
    }

    /**
     * short hand to retrieve route name
     */
    public get routeName(): string {
        return (this.tripData) ? this.tripData.routeName : '';
    }

    /**
     * List of passages
     */
    public get tripPassages(): IActualTripPassage[] {
        return (this.tripData !== undefined) ? this.tripData.actual : [];
    }

    private handleError(err?: any): Observable<any> {
        let status: UpdateStatus = UpdateStatus.ERROR;
        if (err.status) {
            // Http Error
            const statusCode: number = err.status;
            if (statusCode === 404) {
                status = UpdateStatus.NOT_FOUND;
            } else if (statusCode >= 500 && statusCode < 600) {
                status = UpdateStatus.SERVER_ERROR;
            }
        }
        return of({
            passages: this.tripPassages,
            status: status,
            timestamp: 0
        });
    }
    public ngAfterViewInit(): void {
        const tripIdObvservable: Observable<string> = this.route.params
            .pipe(map((params: { tripId?: string }) => params.tripId ? params.tripId : ""));
        this.status.pipe(debounceTime(5000),
            map(() => {
                return this.route.snapshot.params['tripId'];
            }),
            flatMap((tripId: TripId) => {
                return this.apiService.getTripPassages(tripId);
            }),
            map((passages: TripPassagesLocation): IPassageStatus => {
                return {
                    passages: passages,
                    timestamp: Date.now(),
                    status: UpdateStatus.LOADED
                }
            }),
            catchError(this.handleError.bind(this)))
            .subscribe(new Subscriber((val) => {
                this.status.next(val);
            }));
    }

    public ngOnDestroy(): void {
        this.updateObservable.unsubscribe();
    }

}

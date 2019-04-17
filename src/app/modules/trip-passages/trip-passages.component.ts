import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IActualTripPassage, TripId } from '@donmahallem/trapeze-api-types';
import { combineLatest, timer, BehaviorSubject, Observable, Subscriber, Subscription } from 'rxjs';
import { catchError, filter, map, mergeMap, retry } from 'rxjs/operators';
import { TripPassagesLocation } from 'src/app/models';
import { ApiService } from '../../services';

enum UpdateStatus {
    LOADING = 1,
    ERROR = 2,
    LOADED = 3,
    PAUSED = 4,
}
@Component({
    selector: 'app-trip-passages',
    styleUrls: ['./trip-passages.component.scss'],
    templateUrl: './trip-passages.component.pug',
})
export class TripPassagesComponent implements AfterViewInit, OnDestroy {
    public tripData: TripPassagesLocation = undefined;
    private updateObservable: Subscription;
    private updateStatusSubject: BehaviorSubject<UpdateStatus> = new BehaviorSubject(UpdateStatus.LOADING);
    public readonly StatusOps: typeof UpdateStatus = UpdateStatus;
    constructor(private route: ActivatedRoute, private apiService: ApiService) {
        this.tripData = this.route.snapshot.data.tripPassages;
    }

    public get updateStatus(): UpdateStatus {
        return this.updateStatusSubject.getValue();
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

    private handleError<T>(operation = 'operation', result?: T) {
        this.updateStatusSubject.next(UpdateStatus.ERROR);
        return (error: any): Observable<T> => {

            // Let the app keep running by returning an empty result.
            return error;
        };
    }

    private updateData(data: TripPassagesLocation): void {
        this.updateStatusSubject.next(UpdateStatus.LOADED);
        if (data.tripId === this.tripId) {
            this.tripData = data;
        }
    }

    public ngAfterViewInit(): void {
        const tripIdObvservable: Observable<string> = this.route.params.pipe(map((a) => a.tripId));
        this.updateObservable = combineLatest(timer(5000, 5000), tripIdObvservable)
            .pipe(
                map((a) => a[1]),
                filter(num => num !== null),
                mergeMap((tripId: TripId): Observable<TripPassagesLocation> => {
                    return this.apiService.getTripPassages(tripId);
                }),
                catchError(this.handleError.bind(this)),
                retry(3))
            .subscribe(new Subscriber(this.updateData.bind(this), this.handleError.bind(this)));
    }

    public ngOnDestroy(): void {
        this.updateObservable.unsubscribe();
    }

}

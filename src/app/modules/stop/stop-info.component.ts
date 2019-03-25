import {
    Component,
    AfterViewInit,
    OnDestroy
} from '@angular/core';
import { TripPassages } from './../../models';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { timer, Observable, Subscription, of, combineLatest } from 'rxjs';
import { catchError, map, tap, mergeMapTo, filter, mergeMap, throttle } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../services';
@Component({
    selector: 'app-stop-info',
    templateUrl: './stop-info.component.pug',
    styleUrls: ['./stop-info.component.scss']
})
export class StopInfoComponent implements AfterViewInit, OnDestroy {

    constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router) {
        route.params.subscribe((params) => {
            this.tripId = params.tripId;
        });
    }

    public get timeUntilRefresh(): number {
        return this.mTimeUntilRefresh;
    }

    public get isEmptyList(): boolean {
        return this.mEmptyList;
    }
    public tripId: string;
    public routeName: string;
    public tripData: any;
    private tripPassages: any[] = [];
    private updateObservable: Subscription;
    private mEmptyList = false;
    private mTimerObservable: Observable<number>;
    private mTimeUntilRefresh = 0;

    public routes: any[] = [];

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            console.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

    private updateData(data: TripPassages): void {
        console.log(data);
        this.routeName = data.routeName;
        if (data.tripId === this.tripId) {
            this.tripData = data;
            this.tripPassages = data.actual;
            this.mEmptyList = data.actual.length === 0;
            this.routes = (<any>data).routes;
        }
    }
    public onTripSelected(trip) {
        console.log(trip);
        this.router.navigate(['passages', trip.tripId]);
    }
    public convertTime(time, data) {
        if (time > 300) {
            return data.actualTime;
        } else {
            return Math.ceil(time / 60) + 'min';
        }
    }

    public ngAfterViewInit(): void {
        this.mTimerObservable = timer(0, 200);
        this.mTimerObservable.subscribe((val) => {
            const diff = 10 - Math.round((val % 50) / 5);
            if (diff !== this.mTimeUntilRefresh) {
                this.mTimeUntilRefresh = diff;
            }
        });
        const tripIdObvservable: Observable<string> = this.route.params.pipe(map((a) => a.stopId));
        this.updateObservable = combineLatest(this.mTimerObservable.pipe(filter((val: number) => {
            return val % 500 === 0;
        })), tripIdObvservable)
            .pipe(
                map((a) => a[1]),
                filter(num => num !== null),
                mergeMap((stopId: string) => {
                    return this.apiService.getStopDepartures(stopId);
                }),
                catchError(this.handleError('getHeroes', [])),
                catchError((err, a) => of(null)))
            .subscribe(this.updateData.bind(this));
    }

    public ngOnDestroy(): void {
        this.updateObservable.unsubscribe();
    }

}

import {
    Component,
    AfterViewInit,
    OnDestroy
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { timer, Observable, Subscription, of, combineLatest, merge } from 'rxjs';
import { catchError, map, tap, mergeMapTo, filter, mergeMap, throttle, flatMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { IStopInfo } from '@donmahallem/trapeze-api-types';
import { ApiService } from '../../services';
@Component({
    selector: 'app-stop-info',
    templateUrl: './stop-info.component.pug',
    styleUrls: ['./stop-info.component.scss']
})
export class StopInfoComponent implements AfterViewInit, OnDestroy {

    constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router) {
        this.mStopInfo = this.route.snapshot.data.stopInfo;
    }

    public get timeUntilRefresh(): number {
        return this.mTimeUntilRefresh;
    }
    public get stopId(): string {
        return this.route.snapshot.params.stopId;
    }

    public get stopInfo(): IStopInfo {
        return this.mStopInfo;
    }
    public tripPassages: any[] = [];
    private updateSubscription: Subscription;
    private mTimerObservable: Observable<number>;
    private mTimeUntilRefresh = 0;
    private subscription: Subscription;
    public routes: any[] = [];
    private mStopInfo: IStopInfo;
    public errorOccured = false;
    public readonly ticksToRefresh: number = 50;
    /**
     * Tick interval in miliseconds
     */
    public readonly tickInterval: number = 200;

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
    private updateData(data: IStopInfo): void {
        this.errorOccured = false;
        if (data.stopShortName === this.stopId) {
            this.mStopInfo = data;
        }
    }
    public convertTime(time, data) {
        if (time > 300) {
            return data.actualTime;
        } else {
            return Math.ceil(time / 60) + 'min';
        }
    }
    public ngAfterViewInit(): void {
        this.mTimerObservable = timer(this.tickInterval, this.tickInterval);
        this.mTimerObservable.subscribe((tick: number) => {
            const ticksLeft: number = this.ticksToRefresh - (tick % this.ticksToRefresh);
            const diff: number = Math.round((ticksLeft * this.tickInterval) / 1000);
            if (diff !== this.mTimeUntilRefresh) {
                this.mTimeUntilRefresh = diff;
            }
        });
        const stopIdObvservable: Observable<string> = this.route.params
            .pipe(map((a: { stopId: string }): string => a.stopId));
        const refreshObservable = combineLatest(this.mTimerObservable.pipe(filter((val: number) => {
            return val % this.ticksToRefresh === 0 && val > 0;
        })), stopIdObvservable)
            .pipe(
                map((a): string => a[1]),
                flatMap((stopId: string): Observable<IStopInfo> => {
                    return this.apiService.getStopDepartures(stopId);
                }),
                catchError((err, a) => {
                    this.errorOccured = true;
                    return of(null);
                }),
                filter((item: IStopInfo) => {
                    return item !== null;
                }));
        /**
         * combine observables
         */
        this.updateSubscription = merge(refreshObservable, this.route.data.pipe(map((value) => {
            return value.stopInfo;
        })))
            .subscribe(this.updateData.bind(this));
    }

    public ngOnDestroy(): void {
        this.updateSubscription.unsubscribe();
    }

}

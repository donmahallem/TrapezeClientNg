import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IStopPassage } from '@donmahallem/trapeze-api-types';
import { combineLatest, merge, of, timer, Observable, Subscription } from 'rxjs';
import { catchError, filter, flatMap, map } from 'rxjs/operators';
import { ApiService } from '../../services';
@Component({
    selector: 'app-stop-info',
    styleUrls: ['./stop-info.component.scss'],
    templateUrl: './stop-info.component.pug',
})
export class StopInfoComponent implements AfterViewInit, OnDestroy {

    constructor(private route: ActivatedRoute, private apiService: ApiService) {
        this.mStopInfo = this.route.snapshot.data.stopInfo;
    }

    public get timeUntilRefresh(): number {
        return this.mTimeUntilRefresh;
    }
    public get stopId(): string {
        return this.route.snapshot.params.stopId;
    }

    public get stopInfo(): IStopPassage {
        return this.mStopInfo;
    }
    public tripPassages: any[] = [];
    private updateSubscription: Subscription;
    private mTimerObservable: Observable<number>;
    private mTimeUntilRefresh = 0;
    public routes: any[] = [];
    private mStopInfo: IStopPassage;
    public errorOccured = false;
    public readonly ticksToRefresh: number = 50;
    /**
     * Tick interval in miliseconds
     */
    public readonly tickInterval: number = 200;

    private updateData(data: IStopPassage): void {
        this.errorOccured = false;
        if ((<any>data).stopShortName === this.stopId) {
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
                flatMap((stopId: string): Observable<IStopPassage> => {
                    return this.apiService.getStopPassages(stopId);
                }),
                catchError((err, a) => {
                    this.errorOccured = true;
                    return of(undefined);
                }),
                filter((item: IStopPassage) => {
                    return item !== undefined;
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

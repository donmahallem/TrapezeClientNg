import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IStopLocation, IStopPassage, StopId, IStopInfo } from '@donmahallem/trapeze-api-types';
import { combineLatest, from, merge, timer, Observable, Subscription, BehaviorSubject } from 'rxjs';
import { catchError, filter, flatMap, map, debounceTime, debounce } from 'rxjs/operators';
import { StopPointService } from 'src/app/services/stop-point.service';
import { ApiService } from '../../services';

export interface IData {
    location?: IStopLocation,
    passages: IStopPassage
}
@Component({
    selector: 'app-stop-info',
    styleUrls: ['./stop-info.component.scss'],
    templateUrl: './stop-info.component.pug',
})
export class StopInfoComponent implements AfterViewInit, OnDestroy {

    public get timeUntilRefresh(): number {
        return this.mTimeUntilRefresh;
    }
    public get stopId(): string {
        return this.route.snapshot.params.stopId;
    }

    public get stopPassages(): IStopPassage {
        if (this.mStatusSubject.value) {
            if (this.mStatusSubject.value.passages) {
                return this.mStatusSubject.value.passages;
            }
        }
        return undefined;
    }
    public routes: any[] = [];
    public errorOccured = false;
    public readonly ticksToRefresh: number = 50;
    /**
     * Tick interval in miliseconds
     */
    public readonly tickInterval: number = 200;

    /**
     * The stop location.
     * Can be undefined or an instance of {@link IStopLocation}
     */
    public stopLocation: IStopLocation = undefined;
    /**
     * Subscription for the update Observable
     */
    private updateSubscription: Subscription;
    private mTimeUntilRefresh = 0;
    private mStatusSubject: BehaviorSubject<IData>;

    constructor(private route: ActivatedRoute, private apiService: ApiService,
        private stopService: StopPointService) {
    }

    /**
     * Converts the time to a human readable format
     * @param time time
     * @param data data
     */
    public convertTime(time, data) {
        if (time > 300) {
            return data.actualTime;
        } else {
            return Math.ceil(time / 60) + 'min';
        }
    }
    public ngAfterViewInit(): void {
        const source1: Observable<IStopPassage> = this.route.data
            .pipe(map((data: any): IStopPassage => {
                return data.stopInfo;
            }));
        const source2: Observable<IStopPassage> = this.mStatusSubject
            .pipe(debounceTime(2000),
                flatMap((stop: IData): Observable<IStopPassage> => {
                    return this.apiService
                        .getStopPassages(stop.passages.stopShortName);
                }));
        combineLatest(merge(source1, source2), this.stopService
            .stopLocationsObservable)
            .pipe(map((value: [IStopPassage, IStopLocation[]]): IData => {
                const idx: number = value[1].findIndex((stop: IStopLocation): boolean => {
                    return stop.shortName === value[0];
                })
                return {
                    location: idx >= 0 ? value[1][idx] : undefined,
                    passages: value[0]
                };
            }), filter((data: IData): boolean => {
                if (data && data.passages) {
                    return data.passages.stopShortName === this.route.snapshot.params.stopId;
                }
                return false;
            }))
            .subscribe((value: IData) => {
                this.mStatusSubject.next(value);
            });
    }

    public ngOnDestroy(): void {
        this.updateSubscription.unsubscribe();
    }

}

import { ApplicationRef, Injectable } from '@angular/core';
import { IStopLocation, IStopLocations, IStopPointLocation, IStopPointLocations } from '@donmahallem/trapeze-api-types';
import { from, Observable, Subject, Subscriber, of } from 'rxjs';
import { debounceTime, filter, flatMap, map, retryWhen, shareReplay, tap, first, timeoutWith } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AppNotificationService } from './app-notification.service';

export class StopPointLoadSubscriber extends Subscriber<IStopLocation[]> {

    public constructor(private service: StopPointService) {
        super();
    }

    public next(stops: IStopLocation[]): void {
        (this.service as any).mStopLocations = stops;
    }

    public error(err: any): void {
    }

    public complete(): void {
    }
}

/**
 * Service for caching and retrieving Stop Locations
 */
@Injectable({
    providedIn: 'root',
})
export class StopPointService {

    private mStopLocations: IStopLocation[];
    private sharedReplay: Observable<IStopLocation[]> = undefined;
    private retrySubject: Subject<void> = new Subject();
    private mStopPointObservable: Observable<IStopPointLocation[]>;
    private mStopObservable: Observable<IStopLocation[]>;
    constructor(private api: ApiService,
        private notificationService: AppNotificationService,
        private appRef: ApplicationRef) {
        /*
    const stableObservable: Observable<true> = this.appRef
        .isStable
        .pipe(first(stable => stable),
            timeoutWith(5000, of(true)),
            shareReplay(1));*/
        this.mStopObservable = this.setupLocationsPoll(this.api.getStopLocations()
            .pipe(map((stops: IStopLocations): IStopLocation[] =>
                stops.stops)));
        this.mStopPointObservable = this.setupLocationsPoll(this.api.getStopPointLocations()
            .pipe(map((stops: IStopPointLocations): IStopPointLocation[] =>
                stops.stopPoints)));
    }

    public setupLocationsPoll<T extends IStopLocation | IStopPointLocation>(pollObservable: Observable<T[]>): Observable<T[]> {
        return pollObservable
            .pipe(shareReplay(1),
                retryWhen((errors: Observable<any>): Observable<any> =>
                    errors
                        .pipe(tap((err) => this.notificationService.report(err)),
                            debounceTime(5000))));
    }

    public get stopObservable(): Observable<IStopLocation[]> {
        return this.mStopObservable;
    }

    public get stopPointObservable(): Observable<IStopPointLocation[]> {
        return this.mStopPointObservable;
    }

    public get stopLocations(): IStopLocation[] {
        return this.mStopLocations ? this.mStopLocations : [];
    }

    /**
     * retrieves the stop or undefined if not loaded yet or undefined
     * @param stopShortName short name
     */
    public getStopLocation(stopShortName: string): IStopLocation {
        for (const stop of this.stopLocations) {
            if (stop.shortName === stopShortName) {
                return stop;
            }
        }
        return undefined;
    }

    /**
     * Searches the stops for a given stopShortName
     * @param stopShortName the stop shortName
     */
    public searchStop(stopShortName: string): Observable<IStopLocation> {
        return this.stopObservable
            .pipe(
                flatMap((stops: IStopLocation[]): Observable<IStopLocation> =>
                    from(stops)),
                filter((stop: IStopLocation) => {
                    if (stop) {
                        return stop.shortName === stopShortName;
                    }
                    return false;
                }));
    }

}

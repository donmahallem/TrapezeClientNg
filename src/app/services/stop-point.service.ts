import { Injectable } from '@angular/core';
import { IStopLocation, IStopLocations } from '@donmahallem/trapeze-api-types';
import { BehaviorSubject, NEVER, Observable, Subscriber, merge, interval, timer, EMPTY, from, Subject } from 'rxjs';
import { catchError, flatMap, map, shareReplay, startWith, tap, delay } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AppNotificationService } from './app-notification.service';

export class StopPointLoadSubscriber extends Subscriber<IStopLocation[]> {

    public constructor(private service: StopPointService) {
        super();
    }

    public next(stops: IStopLocation[]): void {
        (<any>this.service).mStopLocations = stops;
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
    constructor(private api: ApiService, private notificationService: AppNotificationService) { }

    public createStopLoadObservable(): Observable<IStopLocation[]> {
        return merge(startWith(), this.retrySubject.pipe(delay(10 * 1000)))
            .pipe(
                flatMap((): Observable<IStopLocation[]> => {
                    return this.api.getStations()
                        .pipe(
                            map((value): IStopLocation[] => {
                                return value.stops;
                            }),
                            catchError((err: any, caught: Observable<IStopLocation[]>) => {
                                this.notificationService.report(err);
                                this.retrySubject.next();
                                return NEVER;
                            }));
                }),
                tap((value: IStopLocation[]) => {
                    this.mStopLocations = value;
                }),
                shareReplay(1));
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

    public searchStop(stopShortName: string): Observable<IStopLocation> {
        return this.stopLocationsObservable
            .pipe(flatMap((stops: IStopLocation[]): Observable<IStopLocation> => {
                for (const stop of this.stopLocations) {
                    if (stop.shortName === stopShortName) {
                        return from([stop]);
                    }
                }
                return EMPTY;
            }));
    }

    public get stopLocationsObservable(): Observable<IStopLocation[]> {
        if (this.sharedReplay === undefined) {
            this.sharedReplay = this.createStopLoadObservable();
        }
        return this.sharedReplay;
    }

}

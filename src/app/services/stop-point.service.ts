import { Injectable } from '@angular/core';
import { IStopLocation, IStopLocations } from '@donmahallem/trapeze-api-types';
import { BehaviorSubject, NEVER, Observable, Subscriber } from 'rxjs';
import { catchError, flatMap, map, shareReplay } from 'rxjs/operators';
import { ApiService } from './api.service';

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
    private sharedReplay: Observable<IStopLocation[]>;
    private retrySubject: BehaviorSubject<void> = new BehaviorSubject(undefined);
    constructor(private api: ApiService) {
        this.sharedReplay = this.retrySubject
            .pipe(flatMap((err): Observable<IStopLocations> => {
                return this.api.getStations();
            }),
                catchError((err) => {
                    this.retrySubject.next();
                    return NEVER;
                }), map((value): IStopLocation[] => {
                    return value.stops;
                }), shareReplay(1));
        this.sharedReplay.subscribe(new StopPointLoadSubscriber(this));
    }

    public get stopLocations(): IStopLocation[] {
        return this.mStopLocations;
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

    public get stopLocationsObservable(): Observable<IStopLocation[]> {
        return this.sharedReplay;
    }

}

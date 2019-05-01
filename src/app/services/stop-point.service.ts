import { Injectable } from '@angular/core';
import { IStopLocation, IStopLocations } from '@donmahallem/trapeze-api-types';
import { BehaviorSubject, NEVER, Observable, Subscriber } from 'rxjs';
import { catchError, flatMap, map, shareReplay, tap } from 'rxjs/operators';
import { ApiService } from './api.service';

export class StopPointLoadSubscriber extends Subscriber<IStopLocation[]> {

    public constructor(private service: StopPointService) {
        super();
    }

    public next(stops: IStopLocation[]): void {
        this.service.stopLocations = stops;
    }

    public error(err: any): void {
        console.error('resp', err);
    }

    public complete(): void {
        console.info('complete');
    }
}

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
    public set stopLocations(stops: IStopLocation[]) {
        this.mStopLocations = stops;
    }

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

import { Injectable } from '@angular/core';
import { IStopLocation } from '@donmahallem/trapeze-api-types';
import { BehaviorSubject, Observable, Subscriber, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';

export class StopPointLoadSubscriber extends Subscriber<IStopLocation[]> {

    public constructor(private service: StopPointService) {
        super();
    }

    public next(stops: IStopLocation[]): void {
        this.service.stopLocations = stops;
    }

    public error(err: any): void {

    }

    public complete(): void {
    }
}

@Injectable({
    providedIn: 'root',
})
export class StopPointService {

    private stopLocationsSubject: BehaviorSubject<IStopLocation[]> = new BehaviorSubject([]);
    private stopLoadSubscription: Subscription;
    constructor(private api: ApiService) {
    }

    private loadStops(): void {
        this.stopLoadSubscription = this.api.getStations()
            .pipe(map((value) => {
                return value.stops;
            }))
            .subscribe(new StopPointLoadSubscriber(this));
    }
    public get stopLocations(): IStopLocation[] {
        return this.stopLocationsSubject.value;
    }
    public set stopLocations(locations: IStopLocation[]) {
        this.stopLocationsSubject.next(locations ? locations : []);
    }

    public getStopLocation(stopShortName: string): IStopLocation {
        for (const stop of this.stopLocations) {
            if (stop.shortName === stopShortName) {
                return stop;
            }
        }
        return undefined;
    }

    public get isLoading(): boolean {
        return this.stopLoadSubscription && !this.stopLoadSubscription.closed;
    }

    public get stopLocationsObservable(): Observable<IStopLocation[]> {
        if (this.stopLocations.length === 0 && !this.isLoading) {
            this.loadStops();
        }
        return this.stopLocationsSubject.asObservable();
    }

}

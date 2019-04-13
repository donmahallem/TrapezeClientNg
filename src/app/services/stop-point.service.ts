import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscriber, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { StopLocation } from '../models/stop-location.model';
import { ApiService } from './api.service';

export class StopPointLoadSubscriber extends Subscriber<StopLocation[]> {

    public constructor(private service: StopPointService) {
        super();
    }

    public next(stops: StopLocation[]): void {
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

    private stopLocationsSubject: BehaviorSubject<StopLocation[]> = new BehaviorSubject([]);
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
    public get stopLocations(): StopLocation[] {
        return this.stopLocationsSubject.value;
    }
    public set stopLocations(locations: StopLocation[]) {
        this.stopLocationsSubject.next(locations ? locations : []);
    }

    public getStopLocation(stopShortName: string): StopLocation {
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

    public get stopLocationsObservable(): Observable<StopLocation[]> {
        if (this.stopLocations.length === 0 && !this.isLoading) {
            this.loadStops();
        }
        return this.stopLocationsSubject.asObservable();
    }

}

import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, timer, BehaviorSubject, Observable, Subscriber, Subscription } from 'rxjs';
import { filter, map, mergeMap, retry } from 'rxjs/operators';
import { ApiService } from '../../services';
import { TripPassages } from './../../models';

enum UpdateStatus {
    LOADING = 1,
    ERROR = 2,
    LOADED = 3,
    PAUSED = 4,
}
@Component({
    selector: 'app-trip-passages',
    styleUrls: ['./trip-passages.component.scss'],
    templateUrl: './trip-passages.component.pug',
})
export class TripPassagesComponent implements AfterViewInit, OnDestroy {
    public tripId: string;
    public routeName: string;
    public tripData: any;
    public tripPassages: any[] = [];
    private updateObservable: Subscription;
    private updateStatusSubject: BehaviorSubject<UpdateStatus> = new BehaviorSubject(UpdateStatus.LOADING);
    public readonly StatusOps: typeof UpdateStatus = UpdateStatus;
    constructor(private route: ActivatedRoute, private apiService: ApiService) {
        route.params.subscribe((params) => {
            this.tripId = params.tripId;
        });
    }

    public get updateStatus(): UpdateStatus {
        return this.updateStatusSubject.getValue();
    }

    private handleError<T>(operation = 'operation', result?: T) {
        this.updateStatusSubject.next(UpdateStatus.ERROR);
        return (error: any): Observable<T> => {

            // Let the app keep running by returning an empty result.
            return error;
        };
    }

    private updateData(data: TripPassages): void {
        this.routeName = data.routeName;
        this.updateStatusSubject.next(UpdateStatus.LOADED);
        if (data.tripId === this.tripId) {
            this.tripData = data;
            this.tripPassages = data.actual;
            // console.log(this.tripPassages, data.actual);
        }
    }

    public ngAfterViewInit(): void {
        const tripIdObvservable: Observable<string> = this.route.params.pipe(map((a) => a.tripId));
        this.updateObservable = combineLatest(timer(0, 5000), tripIdObvservable)
            .pipe(
                map((a) => a[1]),
                filter(num => num !== null),
                mergeMap(boundsa => {
                    return this.apiService.getTripPassages(boundsa);
                }),
                retry(3))
            .subscribe(new Subscriber(this.updateData.bind(this), this.handleError.bind(this)));
    }
    public refreshData(): void {
    }

    public ngOnDestroy(): void {
        this.updateObservable.unsubscribe();
    }

}

import {
    Component,
    AfterViewInit,
    OnDestroy
} from '@angular/core';
import { TripPassages } from './../../models';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
    timer,
    Observable,
    Subscription,
    of,
    combineLatest,
    BehaviorSubject
} from "rxjs";
import { catchError, map, tap, mergeMapTo, filter, mergeMap, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../services';


enum UpdateStatus {
    LOADING = 1,
    ERROR = 2,
    LOADED = 3,
    PAUSED = 4
}
@Component({
    selector: 'trip-passages',
    templateUrl: './trip.passages.component.pug',
    styleUrls: ['./trip.passages.component.scss']
})
export class TripPassagesComponent implements AfterViewInit, OnDestroy {
    public tripId: string;
    public routeName: string;
    public tripData: TripPassages;
    private tripPassages: any[] = [];
    private updateObservable: Subscription;
    private updateStatusSubject: BehaviorSubject<UpdateStatus> = new BehaviorSubject(UpdateStatus.LOADING);
    public readonly StatusOps: typeof UpdateStatus = UpdateStatus;
    constructor(private route: ActivatedRoute, private apiService: ApiService) {
        console.log("trip passages loaded");
        route.params.subscribe((params) => {
            this.tripId = params.tripId;
        })
    }

    public get updateStatus(): UpdateStatus {
        return this.updateStatusSubject.getValue();
    }


    private handleError<T>(operation = 'operation', result?: T) {
        this.updateStatusSubject.next(UpdateStatus.ERROR);
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            console.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return error;
        };
    }

    private updateData(data: TripPassages): void {
        console.log(data);
        this.routeName = data.routeName;
        this.updateStatusSubject.next(UpdateStatus.LOADED);
        if (data.tripId == this.tripId) {
            this.tripData = data;
            this.tripPassages = data.actual;
            //console.log(this.tripPassages, data.actual);
        }
        console.log(this.updateStatus);
    }


    public ngAfterViewInit(): void {
        const tripIdObvservable: Observable<string> = this.route.params.pipe(map((a) => a.tripId));
        this.updateObservable = combineLatest(timer(0, 5000), tripIdObvservable)
            .pipe(
                map((a) => a[1]),
                filter(num => num !== null),
                mergeMap(boundsa => {
                    console.log("HHAHAH", boundsa);
                    return this.apiService.getTripPassages(boundsa)
                }),
                retry(3))
            .subscribe(this.updateData.bind(this), this.handleError.bind(this));
    }
    public refreshData(): void {
    }

    public ngOnDestroy(): void {
        this.updateObservable.unsubscribe();
    }

}

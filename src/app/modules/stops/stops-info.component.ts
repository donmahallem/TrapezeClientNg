import {
    Component,
    AfterViewInit,
    OnDestroy
} from '@angular/core';
import { TripPassages } from './../../models';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { timer, Observable, Subscription, of, combineLatest, BehaviorSubject, merge } from 'rxjs';
import { catchError, map, tap, mergeMapTo, filter, mergeMap, throttle } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../services';
import { StationsResponse } from 'src/app/models/stations-response.model';
import { StopLocation } from 'src/app/models/stop-location.model';
@Component({
    selector: 'app-stops-info',
    templateUrl: './stops-info.component.pug',
    styleUrls: ['./stops-info.component.scss']
})
export class StopsInfoComponent implements AfterViewInit, OnDestroy {
    private mItems: StopLocation[] = [];
    private mSearchTerm: BehaviorSubject<string> = new BehaviorSubject('s');

    constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router) {

    }
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            console.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

    public filteredList(): Observable<StopLocation[]> {
        return combineLatest(this.mSearchTerm, this.apiService.getStations())
            .pipe(
                map((a): StopLocation[] => {
                    return a[1].stops.filter((stop: StopLocation) => {
                        if (stop.name === undefined) {
                            return false;
                        }
                        return stop.name.indexOf(a[0]) >= 0;
                    });
                }));
    }

    public get items(): StopLocation[] {
        return this.mItems;
    }

    private updateData(data: StopLocation[]): void {
        console.log(data);
        this.mItems = data;
    }

    public onTripSelected(trip) {
        console.log(trip);
        this.router.navigate(['passages', trip.tripId]);
    }
    public convertTime(time, data) {
        if (time > 300) {
            return data.actualTime;
        } else {
            return Math.ceil(time / 60) + 'min';
        }
    }

    public ngAfterViewInit(): void {
        this.filteredList()
            .subscribe(this.updateData.bind(this));
    }

    public ngOnDestroy(): void {
    }

}

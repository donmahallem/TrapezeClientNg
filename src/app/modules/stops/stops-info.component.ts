import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StopLocation } from 'src/app/models/stop-location.model';
import { ApiService } from '../../services';
@Component({
    selector: 'app-stops-info',
    styleUrls: ['./stops-info.component.scss'],
    templateUrl: './stops-info.component.pug',
})
export class StopsInfoComponent implements AfterViewInit, OnDestroy {
    private mItems: StopLocation[] = [];
    private mSearchTerm: BehaviorSubject<string> = new BehaviorSubject('s');

    constructor(private apiService: ApiService, private router: Router) {

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
        this.mItems = data;
    }

    public onTripSelected(trip) {
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

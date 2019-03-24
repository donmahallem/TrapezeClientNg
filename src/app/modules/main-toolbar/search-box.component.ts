import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatSidenavContainer, MatSidenav, MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable, of, from, Subscriber } from 'rxjs';
import { startWith, map, single, shareReplay, flatMap } from 'rxjs/operators';
import { StopLocation } from 'src/app/models/stop-location.model';
import { DrawableDirective } from 'src/app/drawable.directive';
import { SidebarService } from 'src/app/services/sidebar.service';
import { ApiService } from 'src/app/services';
import { Router } from '@angular/router';
@Component({
    selector: 'app-toolbar-search',
    templateUrl: './search-box.component.pug',
    styleUrls: ['./search-box.component.scss']
})
export class ToolbarSearchBoxComponent implements OnInit, OnDestroy {

    stopsObservable: Observable<StopLocation[]>;
    myControl = new FormControl();
    filteredOptions: Observable<StopLocation[]>;

    @ViewChild(MatAutocomplete)
    autoComplete: MatAutocomplete;
    constructor(private sidebarService: SidebarService,
        private apiService: ApiService,
        private router: Router) {
    }

    public onStopSelected(stop?: MatAutocompleteSelectedEvent): void {
        if (stop.option.value) {
            this.router.navigate(['/stop', stop.option.value.shortName]);
        }
    }
    displayFn(user?: StopLocation): string | undefined {
        return user ? user.name : undefined;
    }
    public ngOnInit(): void {
        this.stopsObservable = this.apiService.getStations()
            .pipe(single(),
                map((value) => {
                    return value.stops;
                }),
                shareReplay(1));
        this.filteredOptions = this.myControl.valueChanges
            .pipe(
                startWith(''),
                flatMap((value) => {
                    return this.stopsObservable
                        .pipe(map((stops) => {
                            return stops.filter(option => option.name.toLowerCase().includes(value));
                        }));
                })
            );
    }

    public ngOnDestroy(): void {

    }

}

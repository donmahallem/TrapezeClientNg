import { Component, ViewChild, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatSidenavContainer, MatSidenav } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable, of, from } from 'rxjs';
import { startWith, map, single, shareReplay, flatMap } from 'rxjs/operators';
import { StopLocation } from 'src/app/models/stop-location.model';
import { DrawableDirective } from 'src/app/drawable.directive';
import { SidebarService } from 'src/app/services/sidebar.service';
import { ApiService } from 'src/app/services';
@Component({
    selector: 'app-main-toolbar',
    templateUrl: './main-toolbar.component.pug',
    styleUrls: ['./main-toolbar.component.scss']
})
export class MainToolbarComponent implements OnInit {
    constructor(private sidebarService: SidebarService, private apiService: ApiService) {
        this.stopsObservable = apiService.getStations()
            .pipe(single(),
                map((value) => {
                    return value.stops;
                }),
                shareReplay(1));
    }

    public get isSidenavOpen(): boolean {
        return this.sidenav.opened;
    }
    title = 'app';
    prediction: any;

    @ViewChild(MatSidenavContainer)
    sidenavContainer: MatSidenavContainer;
    @ViewChild(MatSidenav)
    sidenav: MatSidenav;
    predictions: any;
    tripId: string;
    stopsObservable: Observable<StopLocation[]>;
    @ViewChild(DrawableDirective) canvas;
    myControl = new FormControl();
    options: string[] = ['One', 'Two', 'Three'];
    filteredOptions: Observable<StopLocation[]>;
    ngOnInit() {
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
    onVoted(agreed: any) {
        console.log('aa', agreed);
        this.tripId = agreed.tripId;
    }

    public toggleSidebar(): void {
        this.sidebarService.toggleSidebar();
    }


    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.options.filter(option => option.toLowerCase().includes(filterValue));
    }

}

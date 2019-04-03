import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSidenav, MatSidenavContainer } from '@angular/material';
import { Observable } from 'rxjs';
import { flatMap, map, shareReplay, single, startWith } from 'rxjs/operators';
import { DrawableDirective } from 'src/app/drawable.directive';
import { StopLocation } from 'src/app/models/stop-location.model';
import { ApiService } from 'src/app/services';
import { SidebarService } from 'src/app/services/sidebar.service';
@Component({
    selector: 'app-main-toolbar',
    styleUrls: ['./main-toolbar.component.scss'],
    templateUrl: './main-toolbar.component.pug',
})
export class MainToolbarComponent implements OnInit {
    constructor(private sidebarService: SidebarService, private apiService: ApiService) {
        this.stopsObservable = this.apiService.getStations()
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
                }),
            );
    }
    onVoted(agreed: any) {
        this.tripId = agreed.tripId;
    }

    public toggleSidebar(): void {
        this.sidebarService.toggleSidebar();
    }

}

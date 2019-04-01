import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { flatMap, map, startWith } from 'rxjs/operators';
import { StopLocation } from 'src/app/models/stop-location.model';
import { StopPointService } from 'src/app/services/stop-point.service';
@Component({
    selector: 'app-toolbar-search',
    styleUrls: ['./search-box.component.scss'],
    templateUrl: './search-box.component.pug',
})
export class ToolbarSearchBoxComponent implements OnInit, OnDestroy {

    myControl = new FormControl();
    filteredOptions: Observable<StopLocation[]>;

    @ViewChild(MatAutocomplete)
    autoComplete: MatAutocomplete;
    constructor(private stopService: StopPointService,
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
        this.filteredOptions = this.myControl.valueChanges
            .pipe(
                startWith(''),
                flatMap((value) => {
                    return this.stopService.stopLocationsObservable
                        .pipe(map((stops) => {
                            return stops.filter(option => option.name.toLowerCase().includes(value));
                        }));
                }),
            );
    }

    public ngOnDestroy(): void {

    }

}

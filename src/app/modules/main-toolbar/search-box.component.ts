import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
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

    searchControl = new FormControl();
    filteredOptions: Observable<StopLocation[]>;

    @ViewChild(MatAutocomplete)
    autoComplete: MatAutocomplete;
    @ViewChild('searchInput')
    public searchInput: ElementRef;

    @Output()
    public readonly focusSearch: EventEmitter<boolean> = new EventEmitter();
    constructor(private stopService: StopPointService,
        private router: Router) {
    }

    public set searchOpen(open: boolean) {
        if (open) {
            this.searchControl.setValue('');
            this.doFocusSearch();
        }
    }

    public doFocusSearch(): void {
        setTimeout(() => {
            this.searchInput.nativeElement.focus();
            this.searchInput.nativeElement.select();
        }, 0);
    }

    public onLoseFocus(): void {
        this.focusSearch.next(false);
    }

    public onStopSelected(stop?: MatAutocompleteSelectedEvent): void {
        this.searchOpen = false;
        this.focusSearch.next(false);
        if (stop.option.value) {
            this.searchControl.setValue('');
            this.router.navigate(['/stop', stop.option.value.shortName]);
        }
    }
    displayFn(user?: StopLocation): string | undefined {
        return user ? user.name : undefined;
    }
    public ngOnInit(): void {
        this.filteredOptions = this.searchControl.valueChanges
            .pipe(
                startWith(''),
                flatMap((value: string) => {
                    return this.stopService.stopLocationsObservable
                        .pipe(map((stops: StopLocation[]) => {
                            return stops.filter(option => option.name.toLowerCase().includes(value));
                        }));
                }),
            );
    }

    public ngOnDestroy(): void {
    }

}

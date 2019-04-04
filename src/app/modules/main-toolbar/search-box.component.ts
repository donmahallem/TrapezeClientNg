import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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

    private mSearchOpen = false;
    @ViewChild(MatAutocomplete)
    autoComplete: MatAutocomplete;
    @ViewChild('searchInput')
    public searchInput: ElementRef;
    constructor(private stopService: StopPointService,
        private router: Router) {
    }

    public get searchOpen(): boolean {
        return this.mSearchOpen;
    }

    public set searchOpen(open: boolean) {
        this.mSearchOpen = open;
        if (open) {
            this.searchControl.setValue('');
            setTimeout(() => {
                this.searchInput.nativeElement.focus();
                this.searchInput.nativeElement.select();
            }, 0);
        }
    }
    public toggleSearch(event: MouseEvent): void {
        this.searchOpen = !this.searchOpen;
    }

    public onLoseFocus(): void {
        this.searchOpen = false;
    }

    public onStopSelected(stop?: MatAutocompleteSelectedEvent): void {
        this.searchOpen = false;
        if (stop.option.value) {
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

import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, Subscription } from 'rxjs';
import { debounceTime, filter, startWith } from 'rxjs/operators';
@Component({
    selector: 'app-toolbar-search',
    styleUrls: ['./search-box.component.scss'],
    templateUrl: './search-box.component.pug',
})
export class ToolbarSearchBoxComponent implements OnInit, OnDestroy {

    searchControl = new FormControl();
    private updateSubscription: Subscription;

    @ViewChild('searchInput')
    public searchInput: ElementRef;

    @Output()
    public readonly focusSearch: EventEmitter<boolean> = new EventEmitter();
    constructor(private activatedRoute: ActivatedRoute,
        private router: Router) {
    }

    public onLoseFocus(): void {
        this.focusSearch.next(false);
    }

    public ngOnInit(): void {
        this.updateSubscription = this.searchControl.valueChanges
            .pipe(
                startWith(''),
                filter((value: string): boolean => {
                    return value.length > 2;
                }),
                debounceTime(200),
            )
            .subscribe((value: string) => {
                console.log('(JJJ', value);
                this.router.navigate(['search'], {
                    queryParams: {
                        q: value,
                    }, // skipLocationChange: true
                });
            });
    }

    public onSubmit(): void {
        // console.log("submit", this.searchControl.value);
        this.router.navigate(['search'], {
            queryParams: {
                q: this.searchControl.value,
            },
            skipLocationChange: false,
        });
    }

    public ngOnDestroy(): void {
        if (this.updateSubscription) {
            this.updateSubscription.unsubscribe();
        }
    }

}

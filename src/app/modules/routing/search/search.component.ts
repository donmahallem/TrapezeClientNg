import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
    selector: 'app-search',
    styleUrls: ['./search.component.scss'],
    templateUrl: './search.component.pug',
})
export class SearchComponent implements OnInit, OnDestroy {
    private searchParamSubscription: Subscription;
    public data = '';
    public constructor(private activatedRoute: ActivatedRoute) {

    }

    public ngOnInit(): void {
        this.searchParamSubscription = this.activatedRoute
            .queryParams.subscribe((value) => {
                this.data = JSON.stringify(value);
            });
    }
    public ngOnDestroy(): void {
        if (this.searchParamSubscription) {
            this.searchParamSubscription.unsubscribe();
        }
    }
}

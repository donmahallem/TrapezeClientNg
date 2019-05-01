import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Subscription, Observable, from, NEVER } from 'rxjs';
import { IStopLocation } from '@donmahallem/trapeze-api-types';
import { map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
@Component({
    selector: 'app-search',
    styleUrls: ['./search.component.scss'],
    templateUrl: './search.component.pug',
})
export class SearchComponent implements OnInit, OnDestroy {
    private searchParamSubscription: Subscription;
    public data = '';
    private resultObservable: Observable<IStopLocation[]> = NEVER;
    public constructor(private activatedRoute: ActivatedRoute, private titleService: Title) {

    }

    public get results(): Observable<IStopLocation[]> {
        return this.resultObservable;
    }

    public ngOnInit(): void {
        this.searchParamSubscription = this.activatedRoute
            .queryParams.subscribe((value) => {
                this.data = value['q'] ? value['q'] : '';
                this.titleService.setTitle('Search - \"' + this.data + '\"');
            });
        this.resultObservable = this.activatedRoute.data
            .pipe(map((val: Data): IStopLocation[] => {
                if (val['results'])
                    return val['results'];
                return [];
            }));
    }
    public ngOnDestroy(): void {
        if (this.searchParamSubscription) {
            this.searchParamSubscription.unsubscribe();
        }
    }
}

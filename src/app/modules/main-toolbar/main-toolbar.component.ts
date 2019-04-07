import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSidenav, MatSidenavContainer } from '@angular/material';
import { Observable } from 'rxjs';
import { flatMap, map, shareReplay, single, startWith } from 'rxjs/operators';
import { DrawableDirective } from 'src/app/drawable.directive';
import { StopLocation } from 'src/app/models/stop-location.model';
import { ApiService } from 'src/app/services';
import { SidebarService } from 'src/app/services/sidebar.service';
import { ToolbarSearchBoxComponent } from './search-box.component';
@Component({
    selector: 'app-main-toolbar',
    styleUrls: ['./main-toolbar.component.scss'],
    templateUrl: './main-toolbar.component.pug',
})
export class MainToolbarComponent implements OnInit {
    @ViewChild(ToolbarSearchBoxComponent)
    private searchBoxComponent: ToolbarSearchBoxComponent;
    constructor(private sidebarService: SidebarService, private apiService: ApiService) {
    }

    ngOnInit() {
    }

    private mSearchOpen: boolean = false;

    public get searchOpen(): boolean {
        return this.mSearchOpen;
    }

    public set searchOpen(open: boolean) {
        this.mSearchOpen = open;
        if (this.searchBoxComponent)
            this.searchBoxComponent.doFocusSearch();
    }

    public toggleSidebar(): void {
        if (this.searchOpen === true) {
            this.searchOpen = false;
        } else {
            this.sidebarService.toggleSidebar();
        }
    }

    public onFocusSearch(event) {
        this.searchOpen = event;
    }
    public toggleSearch(): void {
        this.searchOpen = !this.searchOpen;
    }

}

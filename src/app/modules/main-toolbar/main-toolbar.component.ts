import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services';
import { SidebarService } from 'src/app/services/sidebar.service';
import { ToolbarSearchBoxComponent } from './search-box.component';
@Component({
    selector: 'app-main-toolbar',
    styleUrls: ['./main-toolbar.component.scss'],
    templateUrl: './main-toolbar.component.pug',
})
export class MainToolbarComponent implements OnInit {
    constructor(private sidebarService: SidebarService, private apiService: ApiService) {
    }

    public get searchOpen(): boolean {
        return this.mSearchOpen;
    }

    public set searchOpen(open: boolean) {
        this.mSearchOpen = open;
        if (this.searchBoxComponent) {
            this.searchBoxComponent.doFocusSearch();
        }
    }
    @ViewChild(ToolbarSearchBoxComponent)
    private searchBoxComponent: ToolbarSearchBoxComponent;

    private mSearchOpen = false;

    ngOnInit() {
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

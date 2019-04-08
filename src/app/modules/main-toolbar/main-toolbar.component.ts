import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services';
import { SidebarService } from 'src/app/services/sidebar.service';
import { ToolbarSearchBoxComponent } from './search-box.component';
import { Router, NavigationEnd, RouterEvent, NavigationStart } from '@angular/router';
import { Subscriber } from 'rxjs';

export class NavigationSubscriber extends Subscriber<RouterEvent>{

    public constructor(private toolbar: MainToolbarComponent) {
        super();
    }
    public next(event: RouterEvent): void {
        if (event instanceof NavigationEnd && event.url.length > 1) {
            console.log("closeable");
            this.toolbar.closeable = true;
        } else if (event instanceof NavigationStart) {
            console.log("not closeable");
            this.toolbar.closeable = false;
        }
    }
}

@Component({
    selector: 'app-main-toolbar',
    styleUrls: ['./main-toolbar.component.scss'],
    templateUrl: './main-toolbar.component.pug',
})
export class MainToolbarComponent implements OnInit {
    public closeable: boolean = false;

    constructor(private sidebarService: SidebarService,
        private router: Router) {
        this.router.events.subscribe(new NavigationSubscriber(this));
    }

    public get searchOpen(): boolean {
        return this.mSearchOpen;
    }

    public set searchOpen(open: boolean) {
        this.mSearchOpen = open;
    }
    @ViewChild(ToolbarSearchBoxComponent)
    private searchBoxComponent: ToolbarSearchBoxComponent;

    private mSearchOpen = false;

    ngOnInit() {
    }

    public toggleSidebar(): void {
        this.sidebarService.toggleSidebar();
    }

    public onFocusSearch(event) {
        this.searchOpen = event;
    }
    public toggleSearch(): void {
        if (this.searchBoxComponent)
            this.searchBoxComponent.doFocusSearch();
    }

}

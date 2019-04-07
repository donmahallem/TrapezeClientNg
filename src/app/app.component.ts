import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavContainer } from '@angular/material';
import { DrawableDirective } from './drawable.directive';
import { SidebarService } from './services/sidebar.service';
@Component({
    selector: 'app-root',
    styleUrls: ['./app.component.scss'],
    templateUrl: './app.component.pug',
})
export class AppComponent implements OnInit {
    title = 'app';
    prediction: any;

    @ViewChild(MatSidenavContainer)
    sidenavContainer: MatSidenavContainer;
    @ViewChild(MatSidenav)
    sidenav: MatSidenav;
    predictions: any;
    tripId: string;
    constructor(private sidebarService: SidebarService) {

    }
    @ViewChild(DrawableDirective) canvas;
    ngOnInit() {
        // this.loadModel()
    }
    onVoted(agreed: any) {
        this.tripId = agreed.tripId;
    }

    public toggleSidebar(): void {
        this.sidenav.toggle();
    }

    public get isSidenavOpen(): boolean {
        return this.sidenav.opened;
    }

}

import { Component } from '@angular/core';
import { SidebarService } from 'src/app/services/sidebar.service';
import { environment } from 'src/environments/environment.example';
@Component({
    selector: 'app-sidebar',
    styleUrls: ['./sidebar.component.scss'],
    templateUrl: './sidebar.component.pug',
})
export class SidebarComponent {
    public constructor(private sidebarService: SidebarService) {

    }

    public closeSidebar(): void {
        this.sidebarService.closeSidebar();
    }

    public get appVersion(): string {
        return environment.version;
    }
}

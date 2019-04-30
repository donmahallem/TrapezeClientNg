import { Component, VERSION } from '@angular/core';
import { SidebarService } from 'src/app/services/sidebar.service';
import { environment } from 'src/environments/environment.example';
@Component({
    selector: 'app-search',
    styleUrls: ['./search.component.scss'],
    templateUrl: './search.component.pug',
})
export class SearchComponent {
    public constructor(private sidebarService: SidebarService) {

    }

}

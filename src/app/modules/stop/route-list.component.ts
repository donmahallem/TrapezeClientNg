import {
    Component,
    Input,
} from '@angular/core';

@Component({
    selector: 'app-route-list',
    styleUrls: ['./route-list.component.scss'],
    templateUrl: './route-list.component.pug',
})
export class RouteListComponent {

    private mDepartures: any[] = [];
    @Input('routes')
    public set routes(deps: any[]) {
        this.mDepartures = deps;
    }

    public get routes(): any[] {
        return this.mDepartures;
    }
    public convertTime(time, data) {
        if (time > 300) {
            return data.actualTime;
        } else {
            return Math.ceil(time / 60) + 'min';
        }
    }

}

import {
    Component,
    Input,
} from '@angular/core';
@Component({
    selector: 'app-departure-list',
    styleUrls: ['./departure-list.component.scss'],
    templateUrl: './departure-list.component.pug',
})
export class DepartureListComponent {

    private mDepartures: any[] = [];
    @Input('departures')
    public set departures(deps: any[]) {
        this.mDepartures = deps;
    }

    public get departures(): any[] {
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

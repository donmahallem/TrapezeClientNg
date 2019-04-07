import {
    Component,
    Input,
} from '@angular/core';
import { IDeparture } from '@donmahallem/trapeze-api-types';
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

    public get hasDepartures(): boolean {
        return (this.mDepartures && this.mDepartures.length > 0);
    }

    public convertTime(data: IDeparture) {
        const time: number = data.actualRelativeTime;
        if (time > 300) {
            return data.actualTime;
        } else {
            return Math.ceil(time / 60) + 'min';
        }
    }

}

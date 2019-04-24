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

    private mDepartures: IDeparture[] = [];
    @Input('departures')
    public set departures(deps: IDeparture[]) {
        this.mDepartures = deps;
    }

    public get departures(): IDeparture[] {
        return this.mDepartures;
    }

    public get hasDepartures(): boolean {
        return this.mDepartures && this.mDepartures.length > 0;
    }

}

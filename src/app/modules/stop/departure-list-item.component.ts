import {
    Component,
    Input,
} from '@angular/core';
import { IDeparture } from '@donmahallem/trapeze-api-types';
import { VEHICLE_STATUS } from '@donmahallem/trapeze-api-types/dist/vehicle-status';
import * as moment from 'moment';
@Component({
    selector: 'app-departure-list-item',
    styleUrls: ['./departure-list-item.component.scss'],
    templateUrl: './departure-list-item.component.pug',
})
export class DepartureListItemComponent {

    private mDeparture: IDeparture = undefined;
    private mDelay: boolean | string = false;
    private mTime = '';
    @Input('departure')
    public set departure(deps: IDeparture) {
        this.mDeparture = deps;
        this.mDelay = this.calculateDelay(deps);
        this.mTime = this.convertTime(deps);
    }

    public get departure(): IDeparture {
        return this.mDeparture;
    }

    public get time(): string {
        return this.mTime;
    }

    public get statusIcon(): string {
        switch (this.mDeparture.status) {
            case VEHICLE_STATUS.PREDICTED:
                return 'directions_bus';
            case VEHICLE_STATUS.DEPARTED:
                return 'directions_bus';
            case VEHICLE_STATUS.STOPPING:
                return 'departure_board';
            case VEHICLE_STATUS.PLANNED:
            default:
                return 'query_builder';
        }
    }

    public get status(): string {
        return this.mDeparture.status;
    }

    public convertTime(data: IDeparture) {
        const time: number = data.actualRelativeTime;
        if (time > 300) {
            return data.actualTime;
        } else {
            return Math.ceil(time / 60) + 'min';
        }
    }

    public get delay(): boolean | string {
        return this.mDelay;
    }

    public calculateDelay(data: IDeparture): false | string {
        if (data && data.actualTime && data.plannedTime) {
            if (data.actualTime !== data.plannedTime) {
                const actual: moment.Moment = moment(data.actualTime, 'HH:mm');
                const planned: moment.Moment = moment(data.plannedTime, 'HH:mm');
                return '+' + moment.duration(actual.diff(planned)).asMinutes();
            }
        }
        return false;
    }

}

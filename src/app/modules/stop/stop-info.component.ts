import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IStopLocation, IStopPassage } from '@donmahallem/trapeze-api-types';
import { StopInfoService } from './stop-info.service';

export interface IData {
    location?: IStopLocation;
    passages: IStopPassage;
}
@Component({
    selector: 'app-stop-info',
    styleUrls: ['./stop-info.component.scss'],
    templateUrl: './stop-info.component.pug',
    providers: [StopInfoService],
    changeDetection: ChangeDetectionStrategy.Default,

})
export class StopInfoComponent {

    constructor(public stopInfoService: StopInfoService) { }
    /**
     * Converts the time to a human readable format
     * @param time time
     * @param data data
     */
    public convertTime(time, data) {
        if (time > 300) {
            return data.actualTime;
        } else {
            return Math.ceil(time / 60) + 'min';
        }
    }

}

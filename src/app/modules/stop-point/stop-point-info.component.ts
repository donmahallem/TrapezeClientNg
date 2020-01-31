import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StopPointInfoService } from './stop-point-info.service';

@Component({
    selector: 'app-stop-point-info',
    styleUrls: ['./stop-point-info.component.scss'],
    templateUrl: './stop-point-info.component.pug',
    providers: [StopPointInfoService],
    changeDetection: ChangeDetectionStrategy.Default,

})
export class StopPointInfoComponent {

    constructor(public stopInfoService: StopPointInfoService) {
        this.stopInfoService.passagesObservable.subscribe((val) => {
            console.log('pass', val);
        });
        this.stopInfoService.locationObservable.subscribe((val) => {
            console.log('loc', val);
        });
    }
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

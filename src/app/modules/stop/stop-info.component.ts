import { AfterViewInit, Component, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IStopLocation, IStopPassage, StopId, IStopInfo } from '@donmahallem/trapeze-api-types';
import { combineLatest, from, merge, timer, Observable, Subscription, BehaviorSubject, interval, of } from 'rxjs';
import { catchError, filter, flatMap, map, debounceTime, debounce } from 'rxjs/operators';
import { StopPointService } from 'src/app/services/stop-point.service';
import { ApiService } from '../../services';
import { StopInfoService } from './stop-info.service';

export interface IData {
    location?: IStopLocation,
    passages: IStopPassage
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

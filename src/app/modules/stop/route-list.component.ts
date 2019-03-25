import {
    Component,
    AfterViewInit,
    OnDestroy,
    Input
} from '@angular/core';
import { TripPassages } from './../../models';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { timer, Observable, Subscription, of, combineLatest } from 'rxjs';
import { catchError, map, tap, mergeMapTo, filter, mergeMap, throttle } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../services';
@Component({
    selector: 'app-route-list',
    templateUrl: './route-list.component.pug',
    styleUrls: ['./route-list.component.scss']
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

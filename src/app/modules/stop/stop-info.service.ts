import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IStopLocation, IStopPassage, StopShortName } from '@donmahallem/trapeze-api-types';
import { Observable, Subject } from 'rxjs';
import { delay, distinctUntilChanged, flatMap, map, startWith, switchMap } from 'rxjs/operators';
import { ApiService, StopPointService } from 'src/app/services';

export interface IData {
    location?: IStopLocation;
    passages: IStopPassage;
}
@Injectable()
export class StopInfoService {
    public readonly stopObservable: Observable<IStopPassage>;
    public readonly locationObservable: Observable<IStopLocation>;
    private mStatusSubject: Subject<true> = new Subject();
    constructor(private route: ActivatedRoute,
                private apiService: ApiService,
                private stopService: StopPointService) {
        const stopFromResolver: Observable<IStopPassage> = this.route.data
            .pipe(map((data: any): IStopPassage =>
                data.stopInfo));
        this.stopObservable = stopFromResolver
            .pipe(switchMap((passage: IStopPassage): Observable<IStopPassage> =>
                this.mStatusSubject
                    .pipe(delay(5000), flatMap((): Observable<IStopPassage> =>
                        this.apiService
                            .getStopPassages(passage.stopShortName as any)), startWith(passage))));

        this.locationObservable = this.stopService.filterStop(stopFromResolver
            .pipe(map((passage: IStopPassage): StopShortName => passage.stopShortName),
                distinctUntilChanged()));
    }
}

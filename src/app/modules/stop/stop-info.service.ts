import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IStopLocation, IStopPassage } from '@donmahallem/trapeze-api-types';
import { combineLatest, from, Observable, Subject } from 'rxjs';
import { delay, first, flatMap, map, startWith, switchMap } from 'rxjs/operators';
import { ApiService, StopPointService } from 'src/app/services';

export interface IStatus {
    location?: IStopLocation;
    stop: IStopPassage;
}
@Injectable()
export class StopInfoService {
    public readonly statusObservable: Observable<IStatus>;
    private mStatusSubject: Subject<true> = new Subject();
    constructor(private route: ActivatedRoute,
        private apiService: ApiService,
        private stopService: StopPointService) {
        const stopFromResolver: Observable<IStopPassage> = this.route.data
            .pipe(map((data: any): IStopPassage =>
                data.stopInfo));
        this.statusObservable = stopFromResolver
            .pipe(switchMap((stopPassage: IStopPassage): Observable<IStatus> => {
                const passageRefreshObservable: Observable<IStopPassage> = this
                    .createStopPassageRefreshObservable(stopPassage);
                const locationObservable: Observable<IStopLocation> = this
                    .createStopLocationObservable(stopPassage);

                return combineLatest(passageRefreshObservable, locationObservable)
                    .pipe(map((mapValue: [IStopPassage, IStopLocation]): IStatus =>
                        ({
                            stop: mapValue[0],
                            location: mapValue[1],
                        })));
            }));
    }

    public createStopLocationObservable(stopPassage: IStopPassage): Observable<IStopLocation> {
        return this.stopService
            .stopObservable
            .pipe(flatMap((stopLocations: IStopLocation[]): Observable<IStopLocation> =>
                from(stopLocations)
                    .pipe(first((stopLocation: IStopLocation): boolean =>
                        (stopLocation && stopLocation.shortName === stopPassage.stopShortName), undefined))));
    }

    public createStopPassageRefreshObservable(stopPassage: IStopPassage): Observable<IStopPassage> {
        return this.mStatusSubject
            .pipe(delay(5000),
                flatMap((): Observable<IStopPassage> =>
                    this.apiService
                        .getStopPassages(stopPassage.stopShortName as any)),
                startWith(stopPassage));
    }
}

import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, StopPointService } from 'src/app/services';
import { BehaviorSubject, Observable, combineLatest, merge } from 'rxjs';
import { IStopLocation, IStopPassage, IStopLocations, IActualDeparture, IRoute } from '@donmahallem/trapeze-api-types';
import { map, flatMap, debounceTime, filter, tap, share, distinctUntilChanged, startWith, shareReplay } from 'rxjs/operators';

export interface IData {
    location?: IStopLocation,
    passages: IStopPassage
}
@Injectable()
export class StopInfoService {
    private mStatusSubject: BehaviorSubject<IData> = new BehaviorSubject(undefined);
    private mStatusObservable: Observable<IData>;
    constructor(private route: ActivatedRoute,
        private apiService: ApiService,
        private stopService: StopPointService) {
        const source1: Observable<IStopPassage> = this.route.data
            .pipe(map((data: any): IStopPassage => {
                return data.stopInfo;
            }));
        const source2: Observable<IStopPassage> = this.mStatusSubject
            .pipe(debounceTime(2000),
                flatMap((stop: IData): Observable<IStopPassage> => {
                    return this.apiService
                        .getStopPassages(stop.passages.stopShortName as any);
                }));
        const source3: Observable<IStopLocation[]> = this.stopService
            .stopLocationsObservable;
        this.mStatusObservable = combineLatest(merge(source1, source2), source3)
            .pipe(map((value: [IStopPassage, IStopLocation[]]): IData => {
                const idx: number = value[1].findIndex((stop: IStopLocation): boolean => {
                    return stop.shortName === value[0].stopShortName;
                });
                return {
                    location: idx >= 0 ? value[1][idx] : undefined,
                    passages: value[0]
                };
            }), filter((data: IData): boolean => {
                if (data && data.passages) {
                    const bb: boolean = data.passages.stopShortName === this.route.snapshot.params.stopId;
                    return bb;
                }
                return false;
            }), tap((data: IData): void => {
                this.mStatusSubject.next(data);
            }), shareReplay(1));
    }
    public get statusObservable(): Observable<IData> {
        return this.mStatusObservable;
    }

    public get locationObservable(): Observable<IStopLocation> {
        return this.statusObservable
            .pipe(map((data: IData): IStopLocation => {
                return data.location;
            }), distinctUntilChanged((prev: IStopLocation, curr: IStopLocation): boolean => {
                if (prev === curr) {
                    return true;
                }
                if (prev && curr) {
                    return prev.id === curr.id &&
                        prev.longitude === curr.longitude &&
                        prev.latitude === curr.latitude;
                }
                return false;
            }));
    }

    public get passagesObservable(): Observable<IStopPassage> {
        return this.statusObservable
            .pipe(map((data: IData): IStopPassage => {
                return data.passages;
            }));
    }
    public get actualPassagesObservable(): Observable<IActualDeparture[]> {
        return this.statusObservable
            .pipe(map((data: IData): IActualDeparture[] => {
                return data.passages.actual || [];
            }));
    }
    public get routesObservable(): Observable<IRoute[]> {
        return this.statusObservable
            .pipe(map((data: IData): IRoute[] => {
                return data.passages.routes || [];
            }), distinctUntilChanged((prev: IRoute[], curr: IRoute[]): boolean => {
                if (prev.length !== curr.length) {
                    return false;
                }
                for (let i = 0; i < prev.length; i++) {
                    if (prev[i].id !== curr[i].id) {
                        return false;
                    }
                }
                return true;
            }));
    }
}
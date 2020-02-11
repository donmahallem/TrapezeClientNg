import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITripPassages } from '@donmahallem/trapeze-api-types';
import { merge, of, BehaviorSubject, Observable } from 'rxjs';
import { delay, flatMap, map, scan, switchMap, tap } from 'rxjs/operators';
import { ApiService } from 'src/app/services';
import { IPassageStatus, TripPassagesUtil, UpdateStatus } from './trip-util';

@Injectable()
export class TripPassagesService {
    public readonly statusObservable: Observable<IPassageStatus>;
    private readonly statusSubject: BehaviorSubject<IPassageStatus>;
    constructor(private route: ActivatedRoute,
                private apiService: ApiService) {
        this.statusSubject = new BehaviorSubject(route.snapshot.data.tripPassages);
        const refreshObservable: Observable<IPassageStatus> = this.createRefreshPollObservable();
        this.statusObservable = merge(this.route.data.pipe(map((data) => data.tripPassages)), refreshObservable)
            .pipe(scan((acc: IPassageStatus, val: IPassageStatus, idx: number): IPassageStatus => {
                if (acc) {
                    val.failures = val.failures > 0 ? acc.failures + val.failures : 0;
                }
                return val;
            }),
                tap((newStatus: IPassageStatus): void => this.statusSubject.next(newStatus)));
    }

    public createRefreshPollObservable(): Observable<IPassageStatus> {
        return this.statusSubject.pipe(
            switchMap((status: IPassageStatus): Observable<IPassageStatus> => {
                const refreshDelay: number = (status.status === UpdateStatus.LOADED) ?
                    10000 :
                    20000;
                return of(undefined)
                    .pipe(delay(refreshDelay),
                        flatMap((): Observable<ITripPassages> => this.apiService.getTripPassages(status.tripId)),
                        TripPassagesUtil.convertResponse(status.tripId),
                        TripPassagesUtil.handleError(status.tripId));
            }));
    }

}

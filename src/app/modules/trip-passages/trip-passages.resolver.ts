import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { ITripPassages, TripId } from '@donmahallem/trapeze-api-types';
import { of, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from '../../services';
import { ErrorType } from '../error';
import { IPassageStatus, UpdateStatus } from './trip-passages.component';

@Injectable()
export class TripPassagesResolver implements Resolve<IPassageStatus> {

    public constructor(private api: ApiService, private router: Router) { }
    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPassageStatus> {
        return this.api.getTripPassages(route.params.tripId as TripId)
            .pipe(map((data: ITripPassages): IPassageStatus =>
                ({
                    passages: data,
                    status: UpdateStatus.LOADED,
                    timestamp: Date.now(),
                    tripId: route.params.tripId as TripId,
                    failures: 0,
                })), catchError((err: any | HttpErrorResponse): Observable<IPassageStatus> => {
                if (err.status === 404) {
                    this.router.navigate(['error', 'not-found'], {
                        queryParams: {
                            type: ErrorType.PASSAGE_NOT_FOUND,
                        },
                    });
                }
                return of({
                    status: UpdateStatus.ERROR,
                    timestamp: Date.now(),
                    tripId: route.params.tripId as TripId,
                    failures: 1,
                });
            }));
    }
}

import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { ITripPassages, TripId } from '@donmahallem/trapeze-api-types';
import { of, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from '../../services';
import { ErrorType } from '../error';
import { IPassageStatus, TripPassagesUtil } from "./trip-util";

@Injectable()
export class TripPassagesResolver implements Resolve<IPassageStatus> {

    public constructor(private api: ApiService) { }
    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPassageStatus> {
        const tripId: TripId = route.params.tripId as TripId;
        return this.api.getTripPassages(tripId)
            .pipe(TripPassagesUtil.convertResponse(tripId),
                TripPassagesUtil.handleError(tripId));
    }
}

import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../services';

@Injectable()
export class TripPassagesResolver implements Resolve<any> {

    public constructor(private api: ApiService, private router: Router) { }
    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.api.getTripPassages(route.params['tripId'])
            .pipe(catchError((err: any | HttpErrorResponse) => {
                if (err.status === 404) {
                    this.router.navigate(['not-found']);
                }
                return EMPTY;
            }));
    }
}

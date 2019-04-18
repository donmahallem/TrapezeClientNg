import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { StationsResponse } from 'src/app/models/stations-response.model';
import { ApiService } from '../../services';

@Injectable()
export class StopsResolver implements Resolve<StationsResponse> {

    public constructor(private api: ApiService) { }
    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<StationsResponse> {
        return this.api
            .getStations();
    }
}

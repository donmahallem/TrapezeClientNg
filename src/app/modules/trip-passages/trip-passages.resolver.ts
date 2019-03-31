import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../../services';

@Injectable()
export class TripPassagesResolver implements Resolve<any> {

    public constructor(private api: ApiService) { }
    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.api.getTripPassages(route.params['tripId']);
    }
}
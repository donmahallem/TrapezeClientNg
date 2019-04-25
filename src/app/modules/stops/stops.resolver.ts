import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { IStopLocations } from '@donmahallem/trapeze-api-types';
import { Observable } from 'rxjs';
import { ApiService } from '../../services';

/**
 * A Resolver for the Stations Response
 */
@Injectable()
export class StopsResolver implements Resolve<IStopLocations> {

    /**
     * Constructor
     * @param api the {@ApiService}
     */
    public constructor(private api: ApiService) { }
  
    /**
     * Resolves the station response
     * @param route The activated RouteSnapshot
     * @param state The router state snapshot
     * @returns An observable that resolves the {@StationsResponse}
     */
    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<StationsResponse> {
        return this.api
            .getStations();
    }
}

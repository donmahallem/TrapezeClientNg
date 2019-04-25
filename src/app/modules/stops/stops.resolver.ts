import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { IStopLocations } from '@donmahallem/trapeze-api-types';
import { Observable } from 'rxjs';
import { ApiService } from '../../services';

@Injectable()
export class StopsResolver implements Resolve<IStopLocations> {

    public constructor(private api: ApiService) { }
    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IStopLocations> {
        return this.api
            .getStations();
    }
}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { IStopPassage } from '@donmahallem/trapeze-api-types';
import { Observable } from 'rxjs';
import { ApiService } from '../../services';

@Injectable()
export class StopInfoResolver implements Resolve<IStopPassage> {

    public constructor(private api: ApiService) { }
    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IStopPassage> {
        return this.api
            .getStopPassages(route.params['stopId']);
    }
}

import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { IStopLocations } from '@donmahallem/trapeze-api-types';
import { EMPTY, Observable } from 'rxjs';
import { catchError, flatMap, retryWhen, skipWhile, tap } from 'rxjs/operators';
import { ApiService } from '../../services';
import { RetryDialogComponent } from '../common/retry-dialog';

/**
 * A Resolver for the Stations Response
 */
@Injectable()
export class StopsResolver implements Resolve<IStopLocations> {

    /**
     * Constructor
     * @param api the {@ApiService}
     */
    public constructor(private api: ApiService,
        private router: Router,
        private dialog: MatDialog) { }

    /**
     * Resolves the station response
     * @param route The activated RouteSnapshot
     * @param state The router state snapshot
     * @returns An observable that resolves the {@StationsResponse}
     */
    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IStopLocations> {
        return this.api
            .getStations()
            .pipe(catchError((err: any | HttpErrorResponse): Observable<IStopLocations> => {
                if (err.status === 404) {
                    this.router.navigate(['not-found']);
                }
                return EMPTY;
            }),
                retryWhen((errors: Observable<any>): Observable<any> => {
                    let dialogOpen = false;
                    return errors.pipe(skipWhile(() => dialogOpen),
                        flatMap((error: any | HttpErrorResponse) => {
                            dialogOpen = true;
                            const dialogRef: MatDialogRef<RetryDialogComponent, boolean> = this.dialog.open(RetryDialogComponent, {
                                data: {
                                    code: error.status ? error.status : undefined,
                                    message: 'test',
                                },
                            });
                            return dialogRef.afterClosed()
                                .pipe(tap((tapedValue: boolean): void => {
                                    dialogOpen = false;
                                    if (tapedValue !== true) {
                                        throw new Error();
                                    }
                                }));
                        }));
                }));
    }
}

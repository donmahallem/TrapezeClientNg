
import { Observable } from 'rxjs';
import { Injectable, ApplicationRef } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { first, flatMap, shareReplay } from 'rxjs/operators';

/**
 * 
 */
@Injectable()
export class ApiRequestAwaitStable implements HttpInterceptor {
    private readonly isStable: Observable<boolean>;
    constructor(private appRef: ApplicationRef) {
        this.isStable = this.appRef.isStable
            .pipe(first(isStable => isStable === true),
                shareReplay(1));
        this.isStable.subscribe((aa) => console.log("KKK", aa));
    }
    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        /*if (req.url.search("api/geo") >= 0) {
            return this.isStable.pipe(first(isStable => isStable === true),
                flatMap(() => {
                    console.log("Delay");
                    return next.handle(req);
                }));
        } else {
            */
        console.log("Delay");
        return next.handle(req);
        //}
    }
}
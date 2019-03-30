import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Bounds } from './../models';
import { HttpClient, HttpParams } from '@angular/common/http';
import { timer, Observable, Subscription, of, combineLatest, BehaviorSubject } from 'rxjs';
import { catchError, map, tap, mergeMapTo, filter, mergeMap } from 'rxjs/operators';
import { Router, ActivatedRoute, ActivationEnd } from '@angular/router';
@Injectable({
    providedIn: 'root',
})
export class SidebarService {

    private sidebarStatusSubject: BehaviorSubject<boolean> = new BehaviorSubject(true);
    private sidebarObservable: Observable<boolean> = this.sidebarStatusSubject.asObservable();

    public constructor(private router: Router) {
        /**
         * weird workaround for navigation changes inside of lazy loaded modules
         */
        this.router.events
            .pipe(filter(event => event instanceof ActivationEnd && event.snapshot.children.length === 0))
            .subscribe((event: ActivationEnd) => {
                if (event.snapshot.data.openSidebar === true) {
                    this.openSidebar();
                } else {
                    this.closeSidebar();
                }
            });
    }
    public toggleSidebar(): void {
        this.sidebarStatusSubject.next(!this.sidebarStatusSubject.getValue());
    }

    public openSidebar(): void {
        this.sidebarStatusSubject.next(true);
    }

    public closeSidebar(): void {
        this.sidebarStatusSubject.next(false);
    }

    public statusBarObservable(): Observable<boolean> {
        return this.sidebarObservable;
    }
}

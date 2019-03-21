import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Bounds } from './../models';
import { HttpClient, HttpParams } from '@angular/common/http';
import { timer, Observable, Subscription, of, combineLatest, BehaviorSubject } from 'rxjs';
import { catchError, map, tap, mergeMapTo, filter, mergeMap } from 'rxjs/operators';
@Injectable({
    providedIn: 'root',
})
export class SidebarService {

    constructor() { }
    private sidebarStatusSubject: BehaviorSubject<boolean> = new BehaviorSubject(true);
    private sidebarObservable: Observable<boolean> = this.sidebarStatusSubject.asObservable();

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

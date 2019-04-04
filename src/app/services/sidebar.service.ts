import { Injectable } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
@Injectable({
    providedIn: 'root',
})
export class SidebarService {

    private sidebarStatusSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
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

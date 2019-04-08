import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class SidebarService {

    private sidebarStatusSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private sidebarObservable: Observable<boolean> = this.sidebarStatusSubject.asObservable();

    public constructor() {
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

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export enum PositionErrorCode {
    UNKNOWN = 0,
    PERMISSION_DENIED = 1,
    POSITION_UNAVAILABLE = 2,
    TIMED_OUT = 3,
}

@Injectable({
    providedIn: 'root',
})
export class UserLocationService {

    private userLocationSubject: BehaviorSubject<Position | PositionError> = new BehaviorSubject(undefined);
    public readonly userLocationObservable: Observable<Position | PositionError> = this.userLocationSubject.asObservable();

    public constructor() {
    }

    public get featureAvailable(): boolean {
        return (window.location) ? true : false;
    }

    public queryPosition() {
        const geoSuccess = (position: Position): void => {
            this.userLocationSubject.next(position);
        };
        const geoError = (error: PositionError): void => {
            this.userLocationSubject.next(error);
        };
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
    }

}

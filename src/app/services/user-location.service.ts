import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export enum PositionStatusCode {
    UNKNOWN = 0,
    PERMISSION_DENIED = 1,
    POSITION_UNAVAILABLE = 2,
    TIMED_OUT = 3,
    AQUIRED = -1
}

export interface IPositionStatus {
    type: PositionStatusCode
}

export interface IAquiredPositionStatus extends IPositionStatus {
    type: PositionStatusCode.AQUIRED;
    position: Position;
}

export type PositionStatus = IPositionStatus | IAquiredPositionStatus;

@Injectable({
    providedIn: 'root',
})
export class UserLocationService {

    private userLocationSubject: BehaviorSubject<PositionStatus> = new BehaviorSubject({ type: PositionStatusCode.UNKNOWN });
    public readonly userLocationObservable: Observable<PositionStatus> = this.userLocationSubject.asObservable();

    public constructor() {
    }

    public get featureAvailable(): boolean {
        return (window.location) ? true : false;
    }

    public queryPosition() {
        const geoSuccess = (position: Position): void => {
            this.userLocationSubject.next({
                type: PositionStatusCode.AQUIRED,
                position: position
            }
            );
        };
        const geoError = (error: PositionError): void => {
            this.userLocationSubject.next({
                type: error.code
            });
        };
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
    }

}

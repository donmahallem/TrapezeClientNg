import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, filter, flatMap } from 'rxjs/operators';

export enum PositionStatusCode {
    UNKNOWN = 0,
    PERMISSION_DENIED = 1,
    POSITION_UNAVAILABLE = 2,
    TIMED_OUT = 3,
    AQUIRED = -1,
}

export interface IPositionStatus {
    type: PositionStatusCode;
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
        this.userLocationObservable
            .pipe(debounceTime(30000),
                filter((val) => {
                    return val.type !== PositionStatusCode.PERMISSION_DENIED;
                }),
                flatMap((val) => {
                    return this.createPositionRequest();
                }))
            .subscribe((val) => {
                this.userLocationSubject.next({
                    position: val,
                    type: PositionStatusCode.AQUIRED,
                });
            });
    }

    public get featureAvailable(): boolean {
        return (window.location) ? true : false;
    }

    public createPositionRequest(timeout: number = 10000, highAccuracy: boolean = false) {
        return new Observable<any>((subscriber) => {

            const geoSuccess = (position: Position): void => {
                subscriber.next({
                    position: position,
                    type: PositionStatusCode.AQUIRED,
                });
                subscriber.complete();
            };
            const geoError = (error: PositionError): void => {
                subscriber.next({
                    type: error.code,
                });
                subscriber.complete();
            };
            navigator.geolocation.getCurrentPosition(geoSuccess, geoError, {
                enableHighAccuracy: highAccuracy,
                timeout: timeout,
            });
        });
    }

}

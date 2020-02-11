import { ITripPassages, TripId } from '@donmahallem/trapeze-api-types';
import { of, Observable, OperatorFunction } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export enum UpdateStatus {
    LOADING = 1,
    LOADED = 2,
    ERROR = 3,
    PAUSED = 4,
    UNKNOWN = 5,
    NOT_FOUND = 404,
    SERVER_ERROR = 500,
}

export interface IPassageStatus {
    status?: UpdateStatus;
    passages?: ITripPassages;
    timestamp: number;
    tripId: TripId;
    failures: number;
}

export class TripPassagesUtil {
    public static convertResponse(tripId: TripId): OperatorFunction<ITripPassages, IPassageStatus> {
        return map((tripPassages: ITripPassages): IPassageStatus =>
            ({
                passages: tripPassages,
                status: UpdateStatus.LOADED,
                timestamp: Date.now(),
                tripId,
                failures: 0,
            }));
    }
    public static handleError(tripId: TripId): OperatorFunction<any, IPassageStatus> {
        return catchError((err: any): Observable<IPassageStatus> => {
            if (err && err.status) {
                return of({
                    passages: undefined,
                    status: (err.status >= 500 && err.status < 600) ? UpdateStatus.SERVER_ERROR : err.status,
                    timestamp: Date.now(),
                    tripId,
                    failures: 1,
                });
            } else {
                return of({
                    passages: undefined,
                    status: UpdateStatus.ERROR,
                    timestamp: Date.now(),
                    tripId,
                    failures: 1,
                });
            }
        });
    }
}

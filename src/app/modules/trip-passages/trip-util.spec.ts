import { TripId } from '@donmahallem/trapeze-api-types';
import { of, throwError } from 'rxjs';
import { map, toArray } from 'rxjs/operators';
import { TripInfoWithId } from 'src/app/services';
import { IPassageStatus, TripPassagesUtil, UpdateStatus } from './trip-util';

describe('src/app/modules/trip-passages/trip-util', () => {
    describe('TripPassagesUtil', () => {
        const testTimestamp = 38382992;
        const testError: Error = new Error('Should not have been called');
        beforeAll(() => {
            jasmine.clock().install();
            jasmine.clock().mockDate(new Date(testTimestamp));
        });
        afterAll(() => {
            jasmine.clock().uninstall();
        });
        describe('convertResponse(tripId)', () => {
            it('should convert TripInfoWithId to an IPassageStatus', (doneFn: DoneFn) => {
                of(1, 2, 3)
                    .pipe(map((val: number): TripInfoWithId => ({
                        tripId: '' + val as TripId,
                    } as TripInfoWithId)),
                        TripPassagesUtil.convertResponse(undefined),
                        toArray())
                    .subscribe({
                        complete: doneFn,
                        error: doneFn.fail,
                        next: (testResult) => {
                            const testTrips: Partial<TripInfoWithId>[] = [{
                                tripId: '1' as TripId,
                            }, {
                                tripId: '2' as TripId,
                            }, {
                                tripId: '3' as TripId,
                            }];
                            const testStatuses: IPassageStatus[] = testTrips
                                .map((val: TripInfoWithId): IPassageStatus =>
                                    ({
                                        failures: 0,
                                        status: UpdateStatus.LOADED,
                                        timestamp: testTimestamp,
                                        tripId: val.tripId,
                                        tripInfo: val,
                                    }));
                            expect(testResult).toEqual(testStatuses);
                        },
                    });
            });
            it('should pass on an downstream error', (doneFn: DoneFn) => {
                throwError(testError)
                    .pipe(TripPassagesUtil.convertResponse(undefined))
                    .subscribe({
                        complete: () => doneFn.fail(testError),
                        error: (err: any) => {
                            expect(err).toEqual(testError);
                            doneFn();
                        },
                        next: () => doneFn.fail(testError),
                    });
            });
        });
        describe('handleError(tripId)', () => {
            it('should pass on non errors', (doneFn: DoneFn) => {
                of(1, 2, 3)
                    .pipe(TripPassagesUtil.handleError(undefined),
                        toArray())
                    .subscribe({
                        complete: doneFn,
                        error: doneFn.fail,
                        next: (testResult) => {
                            expect(testResult as any).toEqual([1, 2, 3]);
                        },
                    });
            });
            it('should convert errors and not fail', (doneFn: DoneFn) => {
                const testTripId: TripId = 'testTripId' as TripId;
                throwError(testError)
                    .pipe(TripPassagesUtil.handleError(testTripId),
                        toArray())
                    .subscribe({
                        complete: doneFn,
                        error: doneFn.fail,
                        next: (testResult) => {
                            expect(testResult as any).toEqual([{
                                failures: 1,
                                passages: undefined,
                                status: UpdateStatus.ERROR,
                                timestamp: testTimestamp,
                                tripId: testTripId,
                            }]);
                        },
                    });
            });
        });
    });
});

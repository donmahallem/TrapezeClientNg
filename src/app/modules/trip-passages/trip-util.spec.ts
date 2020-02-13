import { TripId } from '@donmahallem/trapeze-api-types';
import { of } from 'rxjs';
import { map, toArray } from 'rxjs/operators';
import { TripInfoWithId } from 'src/app/services';
import { IPassageStatus, TripPassagesUtil, UpdateStatus } from './trip-util';

describe('src/app/modules/trip-passages/trip-util', () => {
    describe('TripPassagesUtil', () => {
        describe('convertResponse(tripId)', () => {
            const testTimestamp = 38382992;
            beforeAll(() => {
                jasmine.clock().install();
                jasmine.clock().mockDate(new Date(testTimestamp));
            });
            afterAll(() => {
                jasmine.clock().uninstall();
            });
            it('statusSubject should be initialized with route snapshot data', (doneFn: DoneFn) => {
                of(1, 2, 3)
                    .pipe(map((val: number): TripInfoWithId => ({
                        tripId: '' + val as TripId,
                    } as TripInfoWithId)),
                        TripPassagesUtil.convertResponse(undefined),
                        toArray())
                    .subscribe({
                        complete: doneFn,
                        error: doneFn,
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
                            doneFn();
                        },
                    });

            });
        });
    });
});

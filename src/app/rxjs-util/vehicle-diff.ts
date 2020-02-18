import { NgZone } from '@angular/core';
import { VehicleId } from '@donmahallem/trapeze-api-types';
import { MonoTypeOperatorFunction, Observable, OperatorFunction, Subscriber, Subscription } from 'rxjs';
import { map, pairwise, startWith } from 'rxjs/operators';
import { ITimestampVehicleLocation } from '../models';
import { TimestampedVehicleLocation } from '../services/vehicle.service';

export const vehicleDiff: <T extends TimestampedVehicleLocation[]>() => OperatorFunction<T, IVehicleDiff> =
    <T extends TimestampedVehicleLocation[]>(): OperatorFunction<T, IVehicleDiff> =>
        (source: Observable<T>): Observable<IVehicleDiff> =>
            source.pipe(startWith(undefined as T),
                pairwise(),
                map((values: [T, T]): IVehicleDiff => {
                    const changes: IVehicleDiff = {
                        added: [],
                        removed: [],
                        unchanged: [],
                        updated: [],
                    };
                    if (values[0] === undefined) {
                        return changes;
                    }
                    for (const newVehicle of values[1]) {
                        const idx: number = values[0].findIndex((val: TimestampedVehicleLocation): boolean => {
                            return val.id === newVehicle.id;
                        });
                        if (idx < 0) {
                            continue;
                        }
                        const oldVehicle: TimestampedVehicleLocation = values[0][idx];
                        if (oldVehicle.isDeleted && newVehicle.isDeleted) {
                            continue;
                        } else if (!oldVehicle.isDeleted && newVehicle.isDeleted) {
                            changes.removed.push(newVehicle);
                        } else if (oldVehicle.isDeleted && !newVehicle.isDeleted) {
                            changes.added.push(newVehicle);
                        } else if (oldVehicle.lastUpdate < newVehicle.lastUpdate) {
                            changes.updated.push(newVehicle);
                        }
                    }
                    return changes;
                }));
enum DiffKey {
    UNCHANGED = 'unchanged',
    UPDATED = 'updated',
    ADDED = 'added',
    REMOVED = 'removed',
}
export interface IVehicleDiff { [key: typeof DiffKey]: TimestampedVehicleLocation[] }
interface IInKeysResult { key: string; idx: number; }
export const findInKeys: (inp: IVehicleDiff, keys: DiffKey[], id: VehicleId) => IInKeysResult =
    (inp: IVehicleDiff, keys: DiffKey[], id: VehicleId): IInKeysResult => {
        for (const key of keys) {
            const idx: number = inp[key].findIndex((searchElement: TimestampedVehicleLocation): boolean => {
                return searchElement.id === id;
            });
            if (idx >= 0) {
                return {
                    idx,
                    key,
                };
            }
        }
        return undefined;
    };
export const createVehicleDiff: <T extends TimestampedVehicleLocation[]>(previousState: IVehicleDiff, newVehicles: T) => IVehicleDiff
    = <T extends TimestampedVehicleLocation[]>(previousState: IVehicleDiff, newVehicles: T): IVehicleDiff => {
        const newDiff: IVehicleDiff = {
            added: [],
            removed: [],
            unchanged: [],
            updated: [],
        };
        // tslint:disable-next-line:triple-equals
        const oldDiff: IVehicleDiff = (previousState == undefined) ? {
            added: [],
            removed: [],
            unchanged: [],
            updated: [],
        } : previousState;

        const vehicleIdx: (inp: TimestampedVehicleLocation[], id: VehicleId) => number = (inp: T, id: VehicleId): number => {
            return inp.findIndex((testVeh: TimestampedVehicleLocation): boolean => {
                return testVeh.id === id;
            });
        };
        const matchedIds: { [key: string]: boolean } = {};
        for (const newVehicle of newVehicles) {
            const key: IInKeysResult = findInKeys(oldDiff, ['added', 'updated', 'changed'], newVehicle.id);
            if (newVehicle.isDeleted === true) {
                if (vehicleIdx(oldDiff.added, newVehicle.id) >= 0) {
                    newDiff.removed.push(newVehicle);
                } else if (vehicleIdx(oldDiff.updated, newVehicle.id) >= 0) {
                    newDiff.removed.push(newVehicle);
                } else if (vehicleIdx(oldDiff.unchanged, newVehicle.id) >= 0) {
                    newDiff.removed.push(newVehicle);
                }
                continue;
            }
            if (vehicleIdx(oldDiff.added, newVehicle.id) >= 0) {
                newDiff.removed.push(newVehicle);
            } else if (vehicleIdx(oldDiff.updated, newVehicle.id) >= 0) {
                newDiff.removed.push(newVehicle);
            } else if (vehicleIdx(oldDiff.unchanged, newVehicle.id) >= 0) {
                newDiff.removed.push(newVehicle);
            }
        }
        return newDiff;
    };

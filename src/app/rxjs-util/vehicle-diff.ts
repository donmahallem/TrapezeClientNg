import { VehicleId } from '@donmahallem/trapeze-api-types';
import { TimestampedVehicleLocation } from '../services/vehicle.service';

enum DiffKey { 'unchanged', 'changed', 'added', 'removed' }
export interface IVehicleDiff {
    added: TimestampedVehicleLocation[];
    changed: TimestampedVehicleLocation[];
    removed: TimestampedVehicleLocation[];
    unchanged: TimestampedVehicleLocation[];
}
interface IInKeysResult { key?: DiffKey; idx: number; vehicle?: TimestampedVehicleLocation; }
export const findInKeys: (inp: IVehicleDiff, keys: DiffKey[], id: VehicleId) => IInKeysResult =
    (inp: IVehicleDiff, keys: DiffKey[], id: VehicleId): IInKeysResult => {
        for (const key of keys) {
            const idx: number = inp[key].findIndex((searchElement: TimestampedVehicleLocation): boolean =>
                searchElement.id === id);
            if (idx >= 0) {
                return {
                    idx,
                    key,
                    vehicle: inp[key][idx],
                };
            }
            return {
                idx,
            };
        }
        return undefined;
    };
export const createVehicleDiff: <T extends TimestampedVehicleLocation[]>(previousState: IVehicleDiff, newVehicles: T) => IVehicleDiff
    = <T extends TimestampedVehicleLocation[]>(previousState: IVehicleDiff, newVehicles: T): IVehicleDiff => {
        const newDiff: IVehicleDiff = {
            added: [],
            changed: [],
            removed: [],
            unchanged: [],
        };
        // tslint:disable-next-line:triple-equals
        const oldDiff: IVehicleDiff = (previousState == undefined) ? {
            added: [],
            changed: [],
            removed: [],
            unchanged: [],
        } : previousState;
        for (const newVehicle of newVehicles) {
            const key: IInKeysResult = findInKeys(oldDiff, [
                DiffKey.added,
                DiffKey.unchanged,
                DiffKey.changed,
            ], newVehicle.id);
            if (newVehicle.isDeleted === true) {
                if (key.idx >= 0) {
                    newDiff.removed.push(newVehicle);
                    continue;
                }
            }
            if (key.idx < 0) {
                newDiff.added.push(newVehicle);
                continue;
            }
            if (key.vehicle.lastUpdate >= newVehicle.lastUpdate) {
                newDiff.unchanged.push(newVehicle);
                continue;
            } else if (key.vehicle.lastUpdate < newVehicle.lastUpdate) {
                newDiff.changed.push(newVehicle);
                continue;
            }
        }
        return newDiff;
    };

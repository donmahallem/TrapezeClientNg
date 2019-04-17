import { ITripPassages, IVehicleLocation } from '@donmahallem/trapeze-api-types';

export * from './vehicle-location.model';
export interface Bounds {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

export type TripPassagesLocation = ITripPassages & {
    location: IVehicleLocation
};
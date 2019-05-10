import { ITripPassages, IVehicleLocation } from '@donmahallem/trapeze-api-types';

export interface Bounds {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

export type TripPassagesLocation = ITripPassages & {
    location: ITimestampVehicleLocation,
};

export interface ITimestampVehicleLocation {
    /**
     * Timestamp of last checkup
     */
    timestamp: number;
    /**
     * Vehicle location
     */
    vehicle: IVehicleLocation;
}

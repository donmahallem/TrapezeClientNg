import { IWayPoint } from '@donmahallem/trapeze-api-types';
import { latLng, LatLng } from 'leaflet';
export type Coord = { lat: number, lon: number } | { latitude: number, longitude: number };
export class LeafletUtil {

    /**
     * Converts the waypoint to lat lng coordinate object
     * @param wayPoint WayPoint to convert
     */
    public static convertWayPointToLatLng(wayPoint: IWayPoint): LatLng {
        return new LatLng(wayPoint.lat / 3600000, wayPoint.lon / 3600000);
    }
    /**
     * Converts a list of WayPoints
     * @param wayPoints WayPoints to convert
     */
    public static convertWayPointsToLatLng(wayPoints: IWayPoint[]): LatLng[] {
        return wayPoints
            .map((value: IWayPoint) => LeafletUtil.convertWayPointToLatLng(value));
    }

    public static convertCoordToLatLng(coord: Coord): LatLng {
        const tmpCoord: any = coord;
        if (tmpCoord.lat && tmpCoord.lon) {
            return latLng(tmpCoord.lat / 3600000, tmpCoord.lon / 3600000);
        } else if (tmpCoord.latitude && tmpCoord.longitude) {
            return latLng(tmpCoord.latitude / 3600000, tmpCoord.longitude / 3600000);
        } else {
            throw new Error('Invalid coordinates');
        }
    }
}

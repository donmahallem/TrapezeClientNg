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
        const _tmp: any = coord;
        if (_tmp.lat && _tmp.lon) {
            return latLng(_tmp.lat / 3600000, _tmp.lon / 3600000);
        } else if (_tmp.latitude && _tmp.longitude) {
            return latLng(_tmp.latitude / 3600000, _tmp.longitude / 3600000);
        } else {
            throw new Error('Invalid coordinates');
        }
    }
}

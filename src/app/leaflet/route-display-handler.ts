import { IVehiclePath } from '@donmahallem/trapeze-api-types';
import * as L from 'leaflet';
import { LeafletUtil } from './leaflet-util';
/**
 * Handles polling and displaying of route data on the map
 */
export class RouteDisplayHandler {
    /**
     * Layer for the route data
     */
    private routeLayer: L.FeatureGroup = undefined;
    /**
     *
     * @param map The map to display the route on
     * @param api the api service to be used
     */
    constructor(private map: L.Map) {
        this.routeLayer = L.featureGroup();
    }
    /**
     * Adds the vehicle path to the map
     * @param paths Path to add
     */
    public setRoutePaths(paths: IVehiclePath[]): void {
        if (this.map && !this.map.hasLayer(this.routeLayer)) {
            this.routeLayer.addTo(this.map);
        }
        this.routeLayer.clearLayers();
        if (paths) {
            for (const path of paths) {
                const pointList: L.LatLng[] = LeafletUtil.convertWayPointsToLatLng(path.wayPoints);
                const firstpolyline = L.polyline(pointList, {
                    color: '#FF0000',
                    opacity: 0.8,
                    smoothFactor: 1,
                    weight: 3,
                });
                firstpolyline.addTo(this.routeLayer);
            }
        }
    }

    /**
     * Clears displayed routes
     */
    public clear(): void {
        this.routeLayer.clearLayers();
    }
}

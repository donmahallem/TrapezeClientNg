import * as L from "leaflet";
import { ApiService } from 'src/app/services';
import { BehaviorSubject, Subscription, Subscriber, from } from 'rxjs';
import { debounce, switchMap, debounceTime, flatMap, catchError } from 'rxjs/operators';
import { TripId } from '@donmahallem/trapeze-api-types';
interface IData {
    hovering: boolean;
    tripId?: TripId;
}
export class MainMapRouteDisplay {
    private updateSubject: BehaviorSubject<IData> = new BehaviorSubject({
        hovering: false
    });
    private subscription: Subscription;
    /**
     * Layer for the route data
     */
    private routeLayer: L.FeatureGroup = undefined;
    constructor(private map: L.Map, private api: ApiService) {

        this.routeLayer = L.featureGroup();
        this.routeLayer.addTo(this.map);
        this.subscription = this.updateSubject
            .pipe(debounceTime(200))
            .pipe(flatMap((value) => {
                if (value.hovering) {
                    return this.api.getRouteByTripId(value.tripId)
                        .pipe(catchError(() => from([undefined])));
                } else {
                    return from([undefined])
                }
            }))
            .subscribe(new Subscriber((value: any) => {
                if (value) {
                    if (value.paths && value.paths.length > 0) {
                        this.setRoutePaths(value.paths);
                        return;
                    }
                }
                this.routeLayer.clearLayers();
            }))
    }
    public setRoutePaths(paths: any[]): void {
        this.routeLayer.clearLayers();
        for (const path of paths) {
            const pointList: any[] = [];
            for (const wayPoint of path.wayPoints) {
                pointList.push(new L.LatLng(wayPoint.lat / 3600000, wayPoint.lon / 3600000));
            }
            const firstpolyline = L.polyline(pointList, {
                color: path.color,
                opacity: 0.5,
                smoothFactor: 1,
                weight: 3,
            });
            firstpolyline.addTo(this.routeLayer);
        }
    }

    public setMouseHovering(isHovering: boolean, tripId?: TripId): void {
        this.updateSubject.next({
            hovering: isHovering,
            tripId
        });
    }
}
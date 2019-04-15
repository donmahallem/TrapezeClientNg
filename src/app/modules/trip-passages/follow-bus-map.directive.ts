import { AfterViewInit, Directive, ElementRef, Input, NgZone, OnDestroy } from '@angular/core';
import { IVehicleLocation } from '@donmahallem/trapeze-api-types';
import * as L from 'leaflet';
import { BehaviorSubject, Subscriber, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, mergeMap } from 'rxjs/operators';
import { ApiService } from 'src/app/services';
import { UserLocationService } from 'src/app/services/user-location.service';
import { LeafletMapComponent } from '../common/leaflet-map.component';

export class RoutesSubscriber extends Subscriber<any> {
    public constructor(private map: FollowBusMapDirective) {
        super();
    }
    public next(routes) {
        this.map.setRoutePaths(routes.paths);
    }
}
@Directive({
    selector: 'map[appTripPassages]',
})
export class FollowBusMapDirective extends LeafletMapComponent implements AfterViewInit, OnDestroy {
    private vehicleLocationSubject: BehaviorSubject<IVehicleLocation> = new BehaviorSubject(undefined);
    constructor(elRef: ElementRef,
        userLocationService: UserLocationService,
        zone: NgZone,
        private apiService: ApiService) {
        super(elRef, zone, userLocationService);
    }
    @Input('location')
    public set location(id: IVehicleLocation) {
        this.vehicleLocationSubject.next(id);
    }

    public get location(): IVehicleLocation {
        return this.vehicleLocationSubject.getValue();
    }

    private stopMarkerLayer: L.FeatureGroup = undefined;

    private updateObservable: Subscription;
    private routePolyLines: L.Polyline[] = [];

    public setRoutePaths(paths: any[]): void {
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
            firstpolyline.addTo(this.getMap());
            this.routePolyLines.push(firstpolyline);
        }
    }
    public ngAfterViewInit() {
        super.ngAfterViewInit();
        this.addMarker();
        this.getMap().dragging.disable();
        this.getMap().touchZoom.disable();
        this.getMap().doubleClickZoom.disable();
        this.getMap().scrollWheelZoom.disable();
        this.getMap().eachLayer((layer: L.Layer) => {
            if (layer instanceof L.TileLayer) {
                layer.options.attribution = '';
                layer.redraw();
            }
        });
    }

    public createVehicleMarker(): L.Icon {

        const greenIcon = L.icon({
            iconAnchor: [12, 12], // point of the icon which will correspond to marker's location
            iconSize: [24, 24], // size of the icon
            iconUrl: 'assets/iconmonstr-arrow-24.png',
            // shadowUrl: 'leaf-shadow.png',
            popupAnchor: [12, 12], // point from which the popup should open relative to the iconAnchor
            shadowAnchor: [32, 32],  // the same for the shadow
            shadowSize: [24, 24], // size of the shadow
        });
        return greenIcon;
    }
    public addMarker(): void {
        this.updateObservable = this.vehicleLocationSubject
            .subscribe((location) => {
                if (this.stopMarkerLayer) {
                    this.stopMarkerLayer.clearLayers();
                } else {
                    this.stopMarkerLayer = new L.FeatureGroup();
                    this.stopMarkerLayer.addTo(this.getMap());
                }
                if (location) {
                    const stopIcon: L.Icon = this.createVehicleMarker();
                    const marker: L.Marker = L.marker([location.latitude / 3600000, location.longitude / 3600000],
                        {
                            clickable: false,
                            icon: stopIcon,
                            interactive: false,
                            title: location.name,
                            zIndexOffset: 100,
                        });
                    (<any>marker).setRotationAngle(location.heading - 90);
                    marker.addTo(this.stopMarkerLayer);
                    this.getMap().panTo({
                        alt: 2000,
                        lat: location.latitude / 3600000,
                        lng: location.longitude / 3600000,
                    },
                        { animate: true });
                }
            });
        this.vehicleLocationSubject
            .pipe(
                filter(num => num !== null),
                distinctUntilChanged(),
                mergeMap(boundsa => {
                    return this.apiService.getRouteByTripId(boundsa.tripId);
                }))
            .subscribe(new RoutesSubscriber(this));
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        this.updateObservable.unsubscribe();
    }

}

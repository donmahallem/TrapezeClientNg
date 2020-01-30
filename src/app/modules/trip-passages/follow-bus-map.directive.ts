import { AfterViewInit, Directive, ElementRef, Input, NgZone, OnDestroy } from '@angular/core';
import { IVehiclePathInfo } from '@donmahallem/trapeze-api-types';
import * as L from 'leaflet';
import { BehaviorSubject, Subscriber, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap } from 'rxjs/operators';
import { createVehicleIcon, RouteDisplayHandler } from 'src/app/leaflet';
import { ApiService } from 'src/app/services';
import { SettingsService } from 'src/app/services/settings.service';
import { TimestampedVehicleLocation } from 'src/app/services/vehicle.service';
import { LeafletMapComponent } from '../common/leaflet-map.component';

@Directive({
    selector: 'map[appTripPassages]',
})
export class FollowBusMapDirective extends LeafletMapComponent implements AfterViewInit, OnDestroy {
    @Input('location')
    public set location(loc: TimestampedVehicleLocation) {
        this.vehicleLocationSubject.next(loc);
    }

    public get location(): TimestampedVehicleLocation {
        return this.vehicleLocationSubject.getValue();
    }
    private vehicleLocationSubject: BehaviorSubject<TimestampedVehicleLocation> = new BehaviorSubject(undefined);

    private stopMarkerLayer: L.FeatureGroup = undefined;

    private updateObservable: Subscription;
    private routeDisplayHandler: RouteDisplayHandler;
    constructor(elRef: ElementRef,
                zone: NgZone,
                private apiService: ApiService,
                settingsService: SettingsService) {
        super(elRef, zone, settingsService);
    }
    public ngAfterViewInit() {
        super.ngAfterViewInit();
        this.addMarker();
        this.getMap().dragging.disable();
        this.getMap().touchZoom.disable();
        this.getMap().doubleClickZoom.disable();
        this.getMap().scrollWheelZoom.disable();
        this.getMap().eachLayer((layer: L.Layer): void => {
            if (layer instanceof L.TileLayer) {
                layer.options.attribution = '';
                layer.redraw();
            }
        });
        this.routeDisplayHandler = new RouteDisplayHandler(this.getMap());
    }
    public addMarker(): void {
        this.updateObservable = this.vehicleLocationSubject
            .pipe(filter((loc: TimestampedVehicleLocation) => {
                if (loc) {
                    return true;
                }
                return false;
            }), map((loc: TimestampedVehicleLocation) => loc))
            .subscribe((location) => {
                if (this.stopMarkerLayer) {
                    this.stopMarkerLayer.clearLayers();
                } else {
                    this.stopMarkerLayer = new L.FeatureGroup();
                    this.stopMarkerLayer.addTo(this.getMap());
                }
                if (location) {

                    const vehicleIcon: L.DivIcon = createVehicleIcon(location.heading, location.name.split(' ')[0], 40);
                    const marker: L.Marker = L.marker([location.latitude / 3600000, location.longitude / 3600000],
                        {
                            icon: vehicleIcon,
                            interactive: false,
                            title: location.name,
                            zIndexOffset: 100,
                        });
                    (marker as any).setRotationAngle(location.heading - 90);
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
            .pipe(filter((loc: TimestampedVehicleLocation) => {
                if (loc) {
                    return true;
                }
                return false;
            }), distinctUntilChanged(),
                mergeMap((boundsa) =>
                    this.apiService.getRouteByTripId(boundsa.tripId)))
            .subscribe(new Subscriber<IVehiclePathInfo>((routes: IVehiclePathInfo) => {
                this.routeDisplayHandler.setRoutePaths(routes.paths);
            }));
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        this.updateObservable.unsubscribe();
    }

}

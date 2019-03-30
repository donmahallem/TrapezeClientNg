import {
    AfterViewInit,
    Component,
    Input,
    OnDestroy,
    ViewChild,
} from '@angular/core';
import * as L from 'leaflet';
import { BehaviorSubject, Subscriber, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, mergeMap } from 'rxjs/operators';
import { ApiService } from '../../services';

interface IVehicleLocation {
    longitude: number;
    latitude: number;
    heading: number;
    tripId: string;
}

export class RoutesSubscriber extends Subscriber<any> {
    public constructor(private map: FollowBusMapComponent) {
        super();
    }
    public next(routes) {
        this.map.setRoutePaths(routes.paths);
    }
}
@Component({
    selector: 'app-follow-bus-map',
    styleUrls: ['./follow-bus-map.component.scss'],
    templateUrl: './follow-bus-map.component.pug',
})
export class FollowBusMapComponent implements AfterViewInit, OnDestroy {
    constructor(private apiService: ApiService) {
        this.vehicleIdSubject = new BehaviorSubject(undefined);
    }

    @Input('location')
    public set vehicleId(id: IVehicleLocation) {
        this.vehicleIdSubject.next(id);
    }

    public get vehicleId(): IVehicleLocation {
        return this.vehicleIdSubject.getValue();
    }

    @ViewChild('mapcontainer') mapContainer;
    private map: L.Map;
    private vehicleIdSubject: BehaviorSubject<IVehicleLocation>;
    private vehicleMarker: L.Marker;
    private updateObservable: Subscription;

    private routePolyLines: L.Polyline[] = [];
    public ngAfterViewInit(): void {
        this.map = L.map(this.mapContainer.nativeElement, { zoomControl: false })
            .setView([54.3364478, 10.1510508], 16);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: undefined,
            maxZoom: 18,
            subdomains: ['a', 'b', 'c'],
        }).addTo(this.map);
        this.map.dragging.disable();
        this.map.touchZoom.disable();
        this.map.doubleClickZoom.disable();
        this.map.scrollWheelZoom.disable();
        this.vehicleMarker = this.createVehicleMarker();
        this.updateObservable = this.vehicleIdSubject
            .pipe(
                filter(num => num !== null))
            .subscribe((res) => {
                this.updateVehicleMarker(res);
            });
        this.vehicleIdSubject
            .pipe(
                filter(num => num !== null),
                distinctUntilChanged(),
                mergeMap(boundsa => {
                    return this.apiService.getRouteByTripId(boundsa.tripId);
                }))
            .subscribe(new RoutesSubscriber(this));

    }

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
            firstpolyline.addTo(this.map);
            this.routePolyLines.push(firstpolyline);
        }
    }

    public updateVehicleMarker(vehicle: IVehicleLocation): void {
        this.vehicleMarker.setLatLng({
            lat: vehicle.latitude / 3600000,
            lng: vehicle.longitude / 3600000,
        });
        (<any>this.vehicleMarker).setRotationAngle(vehicle.heading - 90);
        this.map.panTo({
            alt: 2000,
            lat: vehicle.latitude / 3600000,
            lng: vehicle.longitude / 3600000,
        },
            { animate: true });
    }

    public createVehicleMarker(): L.Marker {

        const greenIcon = L.icon({
            iconAnchor: [12, 12], // point of the icon which will correspond to marker's location
            iconSize: [24, 24], // size of the icon
            iconUrl: 'assets/iconmonstr-arrow-24.png',
            // shadowUrl: 'leaf-shadow.png',
            popupAnchor: [12, 12], // point from which the popup should open relative to the iconAnchor
            shadowAnchor: [32, 32],  // the same for the shadow
            shadowSize: [24, 24], // size of the shadow
        });
        const markerT: L.Marker = L.marker([0, 0],
            {
                icon: greenIcon,
                title: 'vehicle.name',
                zIndexOffset: 100,
            });
        // markerT.setKey(entry.id);
        markerT.addTo(this.map);
        return markerT;
    }

    public ngOnDestroy(): void {
        this.updateObservable.unsubscribe();
    }
}

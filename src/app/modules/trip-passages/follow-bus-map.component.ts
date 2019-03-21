import {
    Component,
    ViewChild,
    OnInit,
    ElementRef,
    Output,
    Input,
    AfterViewInit,
    EventEmitter
} from '@angular/core';
import * as L from 'leaflet';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
    Router
} from '@angular/router';
import { timer, Observable, Subscription, of, BehaviorSubject, combineLatest } from 'rxjs';
import { catchError, map, tap, mergeMapTo, merge, mergeMap, filter, distinctUntilChanged } from 'rxjs/operators';
import { ApiService } from '../../services';
import { resetFakeAsyncZone } from '@angular/core/testing';

interface Loc {
    longitude: number;
    latitude: number;
    heading: number;
    tripId: string;
}

@Component({
    selector: 'follow-bus-map',
    templateUrl: './follow-bus-map.component.pug',
    styleUrls: ['./follow-bus-map.component.scss']
})
export class FollowBusMapComponent implements AfterViewInit {
    constructor(private elRef: ElementRef, private apiService: ApiService, private router: Router) {
        console.log(this.elRef.nativeElement);
        this.vehicleIdSubject = new BehaviorSubject(null);
    }

    @Input('location')
    set vehicleId(id: Loc) {
        this.vehicleIdSubject.next(id);
    }

    get vehicleId(): Loc {
        return this.vehicleIdSubject.getValue();
    }
    @ViewChild('mapcontainer') mapContainer;
    private map: L.Map;
    private vehicleIdSubject: BehaviorSubject<Loc>;
    private vehicleMarker: L.Marker;
    private updateObservable: Subscription;

    ngAfterViewInit() {
        this.map = L.map(this.mapContainer.nativeElement, { zoomControl: false }).setView([54.3364478, 10.1510508], 16);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: null, // 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'your.mapbox.access.token',
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
            .subscribe((res) => {
                for (const key of Array.from(res.paths.keys())) {
                    const pointList: any[] = [];
                    const pathsObj = res.paths[<string>key];
                    // console.log(pathsObj);
                    for (const p of pathsObj.wayPoints) {
                        pointList.push(new L.LatLng(p.lat / 3600000, p.lon / 3600000));
                    }
                    // console.log("points", pointList);
                    const firstpolyline = L.polyline(pointList, {
                        color: pathsObj.color,
                        weight: 3,
                        opacity: 0.5,
                        smoothFactor: 1
                    });
                    firstpolyline.addTo(this.map);
                    // console.log(res);
                }

            });

    }
    public updateVehicleMarker(vehicle: Loc): void {
        this.vehicleMarker.setLatLng({ lat: vehicle.latitude / 3600000, lng: vehicle.longitude / 3600000 });
        this.vehicleMarker.setRotationAngle(vehicle.heading - 90);
        this.map.panTo({ lat: vehicle.latitude / 3600000, lng: vehicle.longitude / 3600000, alt: 2000 }, { animate: true });
    }

    public createVehicleMarker(): L.Marker {

        const greenIcon = L.icon({
            iconUrl: 'assets/iconmonstr-arrow-24.png',
            // shadowUrl: 'leaf-shadow.png',
            iconSize: [24, 24], // size of the icon
            shadowSize: [24, 24], // size of the shadow
            iconAnchor: [12, 12], // point of the icon which will correspond to marker's location
            shadowAnchor: [32, 32],  // the same for the shadow
            popupAnchor: [12, 12] // point from which the popup should open relative to the iconAnchor
        });
        const markerT: L.Marker = L.marker([0, 0],
            {
                icon: greenIcon,
                title: 'vehicle.name',
                zIndexOffset: 100
            });
        // markerT.setKey(entry.id);
        markerT.addTo(this.map);
        return markerT;
    }


    private loadTrip(id: string): Observable<any> {
        return this.apiService.getVehicleLocation(id);
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            console.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

    public ngOnDestroy(): void {
        this.updateObservable.unsubscribe();
    }
}

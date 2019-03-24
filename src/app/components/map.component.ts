import {
    Component,
    ViewChild,
    OnInit,
    ElementRef,
    Output,
    AfterViewInit,
    EventEmitter,
    DoCheck,
    OnDestroy
} from '@angular/core';
import * as L from 'leaflet';
import * as L2 from 'leaflet-rotatedmarker';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Bounds, VehicleLocation } from './../models';
import {
    Router
} from '@angular/router';
import { ApiService } from './../services';
import { timer, Observable, Subscription, of, BehaviorSubject, combineLatest } from 'rxjs';
import { catchError, map, tap, mergeMapTo, merge, mergeMap, filter } from 'rxjs/operators';
import { thisTypeAnnotation } from 'babel-types';
(function () {
    // save these original methods before they are overwritten
    const proto_initIcon = (<any>L.Marker.prototype)._initIcon;
    const proto_setPos = (<any>L.Marker.prototype)._setPos;

    const oldIE = (L.DomUtil.TRANSFORM === 'msTransform');

    L.Marker.addInitHook(function () {
        const iconOptions = this.options.icon && this.options.icon.options;
        let iconAnchor = iconOptions && this.options.icon.options.iconAnchor;
        if (iconAnchor) {
            iconAnchor = (iconAnchor[0] + 'px ' + iconAnchor[1] + 'px');
        }
        this.options.rotationOrigin = this.options.rotationOrigin || iconAnchor || 'center bottom';
        this.options.rotationAngle = this.options.rotationAngle || 0;

        // Ensure marker keeps rotated during dragging
        this.on('drag', function (e) { e.target._applyRotation(); });
    });

    L.Marker.include({
        _initIcon: function () {
            proto_initIcon.call(this);
        },

        _setPos: function (pos) {
            proto_setPos.call(this, pos);
            this._applyRotation();
        },

        _applyRotation: function () {
            if (this.options.rotationAngle) {
                this._icon.style[L.DomUtil.TRANSFORM + 'Origin'] = this.options.rotationOrigin;

                if (oldIE) {
                    // for IE 9, use the 2D rotation
                    this._icon.style[L.DomUtil.TRANSFORM] = 'rotate(' + this.options.rotationAngle + 'deg)';
                } else {
                    // for modern browsers, prefer the 3D accelerated version
                    this._icon.style[L.DomUtil.TRANSFORM] += ' rotateZ(' + this.options.rotationAngle + 'deg)';
                }
            }
        },

        setRotationAngle: function (angle) {
            this.options.rotationAngle = angle;
            this.update();
            return this;
        },

        setRotationOrigin: function (origin) {
            this.options.rotationOrigin = origin;
            this.update();
            return this;
        },
        _key: null,
        setKey: function (key) {
            this._key = key;
        },
        getKey: function () {
            return this._key;
        }
    });
})();


@Component({
    selector: 'app-map-root',
    templateUrl: './map.component.pug',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit, DoCheck, OnDestroy {
    constructor(private elRef: ElementRef, private apiService: ApiService, private router: Router) {
        console.log(this.elRef.nativeElement);
        this.boundsObservable = new BehaviorSubject(null);
    }
    title = 'app';
    @ViewChild('mapcontainer') mapContainer;
    private map: L.Map;
    private vehicleMarkerList: L.Marker[] = new Array();
    @Output('vehicleClicked') vehicleClicked = new EventEmitter<any>();
    private boundsObservable: BehaviorSubject<Bounds>;
    private updateObservable: Subscription;
    ngAfterViewInit() {
        console.log(this.mapContainer);
        this.map = L.map(this.mapContainer.nativeElement, { zoomControl: false }).setView([54.3364478, 10.1510508], 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'your.mapbox.access.token',
            subdomains: ['a', 'b', 'c']
        }).addTo(this.map);
        this.addMarker();
        this.map.on('moveend', () => {
            this.updateBoundsObservable.bind(this)();
        });

        this.updateObservable = combineLatest(timer(0, 5000), this.boundsObservable)
            .pipe(
                map((a) => a[1]),
                filter(num => num !== null),
                mergeMap(boundsa => {
                    return this.loadTrip(boundsa);
                }),
                catchError((err: Error) => {
                    return of();
                }))
            .subscribe((res) => {
                // console.log("loaded", res);
                for (const marker of this.vehicleMarkerList) {
                    marker.remove();
                }
                for (const veh of res.vehicles) {
                    this.addVehicleMarker(veh);
                }
            });
        this.updateBoundsObservable();
    }

    public ngDoCheck(): void {
        if (this.map !== undefined) {
            this.map.invalidateSize();
        }
    }

    public addVehicleMarker(vehicle: VehicleLocation): L.Marker {
        /*
                const greenIcon = L.icon({
                    iconUrl: 'assets/iconmonstr-arrow-24.png',
                    //shadowUrl: 'leaf-shadow.png',
                    iconSize: [24, 24], // size of the icon
                    shadowSize: [24, 24], // size of the shadow
                    iconAnchor: [12, 12], // point of the icon which will correspond to marker's location
                    shadowAnchor: [32, 32],  // the same for the shadow
                    popupAnchor: [12, 12] // point from which the popup should open relative to the iconAnchor
                });*/
        const greenIcon = L.divIcon({
            className: 'vehiclemarker',
            html: '<span>' + vehicle.name.split(' ')[0] + '</span>',
            iconSize: [32, 32], // size of the icon
            shadowSize: [24, 24], // size of the shadow
            iconAnchor: [16, 16], // point of the icon which will correspond to marker's location
            shadowAnchor: [32, 32],  // the same for the shadow
            popupAnchor: [12, 12] // point from which the popup should open relative to the iconAnchor
        });
        const markerT: any = L.marker([vehicle.latitude / 3600000, vehicle.longitude / 3600000],
            {
                icon: greenIcon,
                title: vehicle.name,
                rotationAngle: vehicle.heading - 90,
                zIndexOffset: 100
            });
        // markerT.setKey(entry.id);
        markerT.addTo(this.map);
        markerT.data = vehicle;
        markerT.on('click', this.markerOnClick.bind(this));
        this.vehicleMarkerList.push(markerT);
        return markerT;
    }

    public updateBoundsObservable() {
        const left: number = this.map.getBounds().getWest();
        const right: number = this.map.getBounds().getEast();
        const top: number = this.map.getBounds().getNorth();
        const bottom: number = this.map.getBounds().getSouth();
        const bounds: Bounds = {
            left: left,
            right: right,
            bottom: bottom,
            top: top
        };
        console.log('update loc', bounds);
        this.boundsObservable.next(bounds);
    }

    public createStopIcon() {
        if (false) {
            return L.divIcon({ className: 'my-div-icon', html: 'JJ' });
        } else {
            return L.icon({
                iconUrl: 'assets/iconmonstr-part-24.png',
                // shadowUrl: 'leaf-shadow.png',
                iconSize: [16, 16], // size of the icon
                shadowSize: [24, 24], // size of the shadow
                iconAnchor: [8, 8], // point of the icon which will correspond to marker's location
                shadowAnchor: [32, 32],  // the same for the shadow
                popupAnchor: [8, 8] // point from which the popup should open relative to the iconAnchor
            });
        }
    }

    public addMarker() {
        this.apiService.getStations()
            .subscribe((data: any) => {
                console.log(data);
                for (const entry of data.stops) {
                    if (entry === null) {
                        continue;
                    }
                    if (entry.isDeleted === true) {
                        continue;
                    }
                    // console.log(entry);

                    const greenIcon = this.createStopIcon();
                    const markerT = L.marker([entry.latitude / 3600000, entry.longitude / 3600000],
                        {
                            icon: greenIcon,
                            title: entry.name,
                            zIndexOffset: 10,
                            riseOnHover: true,
                            riseOffset: 10,
                            clickable: true
                        });
                    markerT.addTo(this.map);
                    markerT.on('click', this.stopMarkerOnClick.bind(this, entry));
                    // markerT.setRotationAngle(entry.heading)
                    // markerT.getElement().style.transform += ' rotate(' + (entry.heading + 0) + 'deg)';
                }
            });
    }

    public stopMarkerOnClick(data, e) {
        console.log('StopMarker Clicked', data);
        this.router.navigate(['stop', data.shortName]);
    }
    public markerOnClick(e) {
        // console.log(e);
        this.vehicleClicked.emit(e.target.data);
        this.router.navigate(['passages', e.target.data.tripId]);
    }
    private loadTrip(bounds: Bounds): Observable<any> {
        return this.apiService.getVehicleLocations(bounds);
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

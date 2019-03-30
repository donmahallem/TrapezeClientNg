import { AfterViewInit, Component, DoCheck, ElementRef, EventEmitter, OnDestroy, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { combineLatest, of, timer, BehaviorSubject, Observable, Subscription } from 'rxjs';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';
import { StopLocation } from '../models/stop-location.model';
import { StopPointService } from '../services/stop-point.service';
import { Bounds, VehicleLocation } from './../models';
import { ApiService } from './../services';
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

        _initIcon: function () {
            proto_initIcon.call(this);
        },

        _key: undefined,

        _setPos: function (pos) {
            proto_setPos.call(this, pos);
            this._applyRotation();
        },

        getKey: function () {
            return this._key;
        },
        setKey: function (key) {
            this._key = key;
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
    });
})();

@Component({
    selector: 'app-map-root',
    styleUrls: ['./map.component.scss'],
    templateUrl: './map.component.pug',
})
export class MapComponent implements AfterViewInit, DoCheck, OnDestroy {
    constructor(private elRef: ElementRef,
        private apiService: ApiService,
        private router: Router,
        private stopService: StopPointService) {
        console.log(this.elRef.nativeElement);
        this.boundsObservable = new BehaviorSubject(undefined);
    }
    title = 'app';
    @ViewChild('mapcontainer') mapContainer;
    private map: L.Map;
    private vehicleMarkerList: L.Marker[] = new Array();
    @Output() vehicleClicked = new EventEmitter<any>();
    private boundsObservable: BehaviorSubject<Bounds>;
    private updateObservable: Subscription;
    ngAfterViewInit() {
        console.log(this.mapContainer);
        this.map = L.map(this.mapContainer.nativeElement, { zoomControl: false }).setView([54.3364478, 10.1510508], 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> '
                + 'contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, '
                + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            subdomains: ['a', 'b', 'c'],
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
            iconAnchor: [16, 16], // point of the icon which will correspond to marker's location
            iconSize: [32, 32], // size of the icon
            popupAnchor: [12, 12], // point from which the popup should open relative to the iconAnchor
            shadowAnchor: [32, 32],  // the same for the shadow
            shadowSize: [24, 24], // size of the shadow
        });
        const markerT: any = L.marker([vehicle.latitude / 3600000, vehicle.longitude / 3600000], <any>
            {
                icon: greenIcon,
                rotationAngle: vehicle.heading - 90,
                title: vehicle.name,
                zIndexOffset: 100,
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
            bottom: bottom,
            left: left,
            right: right,
            top: top,
        };
        console.log('update loc', bounds);
        this.boundsObservable.next(bounds);
    }

    public createStopIcon() {
        if (false) {
            return L.divIcon({ className: 'my-div-icon', html: 'JJ' });
        } else {
            return L.icon({
                iconAnchor: [8, 8], // point of the icon which will correspond to marker's location
                // shadowUrl: 'leaf-shadow.png',
                iconSize: [16, 16], // size of the icon
                iconUrl: 'assets/iconmonstr-part-24.png',
                popupAnchor: [8, 8], // point from which the popup should open relative to the iconAnchor
                shadowAnchor: [32, 32],  // the same for the shadow
                shadowSize: [24, 24], // size of the shadow
            });
        }
    }

    public addMarker() {
        this.stopService.stopLocationsObservable
            .subscribe((stops: StopLocation[]) => {
                for (const stop of stops) {
                    if (stop === null) {
                        continue;
                    }

                    const greenIcon = this.createStopIcon();
                    const markerT = L.marker([stop.latitude / 3600000, stop.longitude / 3600000],
                        {
                            clickable: true,
                            icon: greenIcon,
                            riseOffset: 10,
                            riseOnHover: true,
                            title: stop.name,
                            zIndexOffset: 10,
                        });
                    markerT.addTo(this.map);
                    markerT.on('click', this.stopMarkerOnClick.bind(this, stop));
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

    public ngOnDestroy(): void {
        this.updateObservable.unsubscribe();
    }
}

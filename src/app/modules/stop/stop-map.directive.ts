import { AfterViewInit, Directive, ElementRef, Input, NgZone, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { BehaviorSubject } from 'rxjs';
import { StopLocation } from 'src/app/models/stop-location.model';
import { UserLocationService } from 'src/app/services/user-location.service';
import { LeafletMapComponent } from '../common/leaflet-map.component';

@Directive({
    selector: 'map[appStopLocation]',
})
export class StopLocationMapDirective extends LeafletMapComponent implements AfterViewInit, OnDestroy {
    constructor(elRef: ElementRef,
        userLocationService: UserLocationService,
        zone: NgZone) {
        super(elRef, zone, userLocationService);
    }
    @Input('location')
    public set location(loc: StopLocation) {
        this.stopLocationSubject.next(loc);
    }

    private stopMarkerLayer: L.FeatureGroup = undefined;

    private stopLocationSubject: BehaviorSubject<StopLocation> = new BehaviorSubject(undefined);

    public createStopIcon(): L.Icon {
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

    public addMarker(): void {
        this.stopLocationSubject
            .subscribe((location) => {
                if (this.stopMarkerLayer) {
                    this.stopMarkerLayer.clearLayers();
                } else {
                    this.stopMarkerLayer = new L.FeatureGroup();
                    this.stopMarkerLayer.addTo(this.getMap());
                }
                if (location) {
                    const stopIcon: L.Icon = this.createStopIcon();
                    const marker: L.Marker = L.marker([location.latitude / 3600000, location.longitude / 3600000],
                        {
                            clickable: false,
                            icon: stopIcon,
                            interactive: false,
                            title: location.name,
                            zIndexOffset: 100,
                        });
                    marker.addTo(this.stopMarkerLayer);
                    this.getMap().panTo({
                        alt: 2000,
                        lat: location.latitude / 3600000,
                        lng: location.longitude / 3600000,
                    },
                        { animate: true });
                }
            });
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }

}

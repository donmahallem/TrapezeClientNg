import { Location } from '@angular/common';
import { Directive, ElementRef, Input, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { IStopLocation } from '@donmahallem/trapeze-api-types';
import * as L from 'leaflet';
import { createStopIcon, LeafletUtil } from 'src/app/leaflet';
import { SettingsService } from 'src/app/services/settings.service';
import { LeafletMapComponent } from '../leaflet-map.component';

/**
 * Directive displaying a map with the StopLocation
 */
@Directive({
    selector: 'map[appStopLocation]',
})
export class StopLocationMapDirective extends LeafletMapComponent implements OnChanges {
    @Input()
    public stopLocation: IStopLocation;
    private readonly stopMarkerLayer: L.FeatureGroup = undefined;
    constructor(elRef: ElementRef,
                zone: NgZone,
                settingsService: SettingsService,
                public locationService: Location) {
        super(elRef, zone, settingsService);
        this.stopMarkerLayer = new L.FeatureGroup(undefined, {
            attribution: '',
        });
    }

    public onBeforeSetView(map: L.Map): void {
        super.onBeforeSetView(map);
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

    public ngOnChanges(changes: SimpleChanges): void {
        if ('stopLocation' in changes) {
            this.updateLocation();
        }
    }
    public onAfterSetView(map: L.Map): void {
        super.onBeforeSetView(map);
        this.stopMarkerLayer.addTo(this.getMap());
        this.updateLocation();
    }

    public updateLocation(): void {
        this.stopMarkerLayer.clearLayers();
        if (this.stopLocation) {
            const stopIcon: L.Icon = createStopIcon(this.locationService);
            const stopCoordinates: L.LatLng = LeafletUtil.convertCoordToLatLng(this.stopLocation);
            const marker: L.Marker = L.marker(stopCoordinates,
                {
                    icon: stopIcon,
                    interactive: false,
                    title: this.stopLocation.name,
                    zIndexOffset: 100,
                });
            marker.addTo(this.stopMarkerLayer);
            if (this.getMap()) {
                this.getMap().panTo(stopCoordinates,
                    { animate: true });
            }
        }
    }

}

import { Location } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, Input, NgZone, OnDestroy } from '@angular/core';
import { IStopPointLocation } from '@donmahallem/trapeze-api-types';
import * as L from 'leaflet';
import { createStopIcon, LeafletUtil } from 'src/app/leaflet';
import { SettingsService } from 'src/app/services/settings.service';
import { LeafletMapComponent } from '../common/leaflet-map.component';
import { StopPointInfoService } from './stop-point-info.service';

/**
 * Directive displaying a map with the StopLocation
 */
@Directive({
    selector: 'map[appStopPointLocation]',
})
export class StopPointLocationMapDirective extends LeafletMapComponent implements AfterViewInit, OnDestroy {
    private readonly stopMarkerLayer: L.FeatureGroup;
    private stopMarker: L.LatLng;
    constructor(elRef: ElementRef,
                zone: NgZone,
                settingsService: SettingsService,
                public stopService: StopPointInfoService,
                public locationService: Location) {
        super(elRef, zone, settingsService);
        this.stopMarkerLayer = L.featureGroup();
        this.stopMarker = undefined;
    }
    @Input()
    public set location(stop: IStopPointLocation) {
        this.stopMarkerLayer.clearLayers();
        if (stop) {
            this.stopMarker = LeafletUtil.convertCoordToLatLng(stop);
            const stopIcon: L.Icon = createStopIcon(this.locationService);
            const marker: L.Marker = L.marker(this.stopMarker,
                {
                    icon: stopIcon,
                    interactive: false,
                    title: stop.name,
                    zIndexOffset: 100,
                });
            marker.addTo(this.stopMarkerLayer);
            if (this.getMap()) {
                this.getMap().flyTo(this.stopMarker, 15,
                    { animate: true });
            }
        } else {
            this.stopMarker = undefined;
        }
    }
    public onAfterSetView(map: L.Map): void {
        super.onAfterSetView(map);
        map.dragging.disable();
        map.touchZoom.disable();
        map.doubleClickZoom.disable();
        map.scrollWheelZoom.disable();
        map.eachLayer((layer: L.Layer) => {
            if (layer instanceof L.TileLayer) {
                layer.options.attribution = '';
                layer.redraw();
            }
        });
        this.stopMarkerLayer.addTo(map);
        if (this.stopMarker) {
            map.flyTo(this.stopMarker, 15,
                { animate: true });
        }
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }

}

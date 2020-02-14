import { ElementRef, NgZone } from '@angular/core';
import * as L from 'leaflet';
import { SettingsService } from 'src/app/services/settings.service';
import { LeafletMapComponent } from '../leaflet-map.component';

/**
 * Directive displaying a map with the StopLocation
 */
export abstract class HeaderMapDirective extends LeafletMapComponent {

    protected readonly markerLayer: L.LayerGroup = undefined;

    constructor(elRef: ElementRef,
                zone: NgZone,
                settingsService: SettingsService) {
        super(elRef, zone, settingsService);
        this.markerLayer = new L.LayerGroup(undefined, {
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

    public onAfterSetView(map: L.Map): void {
        super.onAfterSetView(map);
        this.markerLayer.addTo(this.getMap());
    }

    /**
     * If the marker is attached it will be removed
     * @param m marker to be removed
     */
    public removeMarker(m: L.Marker): void {
        if (m && this.markerLayer.hasLayer(m)) {
            this.markerLayer.removeLayer(m);
        }
    }

    public panMapTo(panTo: L.LatLng): void {
        if (this.getMap()) {
            this.getMap().panTo(panTo,
                { animate: true });
        }
    }
}

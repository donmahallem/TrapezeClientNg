import { ElementRef, Input, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { IStopLocation, IStopPointLocation, IVehicleLocation } from '@donmahallem/trapeze-api-types';
import * as L from 'leaflet';
import { SettingsService } from 'src/app/services/settings.service';
import { LeafletMapComponent } from '../leaflet-map.component';

/**
 * Directive displaying a map with the StopLocation
 */
export abstract class HeaderMapDirective<T extends IStopLocation | IStopPointLocation | IVehicleLocation>
    extends LeafletMapComponent implements OnChanges {
    @Input()
    public marker: T;
    protected readonly markerLayer: L.LayerGroup = undefined;
    constructor(elRef: ElementRef,
                zone: NgZone,
                settingsService: SettingsService) {
        super(elRef, zone, settingsService);
        this.markerLayer = new L.LayerGroup(undefined, {
            attribution: '',
        });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if ('marker' in changes) {
            this.updateLocation(changes.marker.currentValue);
        }
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
        super.onBeforeSetView(map);
        this.markerLayer.addTo(this.getMap());
        this.updateLocation(undefined);
    }

    public abstract updateLocation(marker: T): void;

}

import { Location } from '@angular/common';
import { Directive, ElementRef, Input, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { IStopLocation, IStopPointLocation } from '@donmahallem/trapeze-api-types';
import * as L from 'leaflet';
import { createStopIcon, LeafletUtil } from 'src/app/leaflet';
import { SettingsService } from 'src/app/services/settings.service';
import { HeaderMapDirective } from './header-map.directive';

type StopTypes = IStopPointLocation | IStopLocation;
/**
 * Directive displaying a map with the StopLocation
 */
@Directive({
    selector: 'map[appStopLocationHeader]',
})
export class StopLocationHeaderMapDirective extends HeaderMapDirective implements OnChanges {
    @Input()
    public stop?: StopTypes;
    private stopMarker: L.Marker;
    constructor(elRef: ElementRef,
                zone: NgZone,
                settingsService: SettingsService,
                public locationService: Location) {
        super(elRef, zone, settingsService);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if ('stop' in changes) {
            const curStop: StopTypes = changes.stop.currentValue;
            const preStop: StopTypes = changes.stop.previousValue;
            if (curStop === undefined) {
                this.updateStop(undefined);
            }
            if (curStop && preStop && curStop.id === preStop.id) {
                return;
            }
            this.updateStop(curStop);
        }
    }

    public onAfterSetView(map: L.Map): void {
        super.onAfterSetView(map);
        this.updateStop(this.stop);
    }

    public createStopMarker(name: string, coord: L.LatLng): L.Marker {
        const stopIcon: L.Icon = createStopIcon(this.locationService);
        const mapMarker: L.Marker = L.marker(coord,
            {
                icon: stopIcon,
                interactive: false,
                title: name,
                zIndexOffset: 100,
            });
        return mapMarker;
    }

    public updateStop(change: StopTypes): void {
        this.removeMarker(this.stopMarker);
        const stopCoordinates: L.LatLng = LeafletUtil.convertCoordToLatLng(change);
        this.stopMarker = this.createStopMarker(change.name, stopCoordinates);
        this.stopMarker.addTo(this.markerLayer);
        this.panMapTo(stopCoordinates);
    }
}

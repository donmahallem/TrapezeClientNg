import { HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IStopLocation, IStopPointLocation, IVehicleLocation } from '@donmahallem/trapeze-api-types';

export abstract class MapHeaderComponent<T extends IVehicleLocation | IStopLocation | IStopPointLocation> implements OnChanges {

    @Input()
    public title: string = undefined;
    @Input()
    public subtitle: string = undefined;
    @HostBinding('class.no-location')
    public blur = false;
    @Input()
    public markerLocation: T;

    public ngOnChanges(changes: SimpleChanges): void {
        if ('markerLocation' in changes) {
            this.blur = this.markerLocation === undefined;
        }
    }
}

import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { IStopLocation, IVehicleLocation, IStopPointLocation } from '@donmahallem/trapeze-api-types';
import { MapHeaderComponent } from './map-header.component';
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-vehicle-map-header-box',
    styleUrls: ['./map-header-box.component.scss'],
    templateUrl: './vehicle-map-header-box.component.pug',
})
export class VehicleMapHeaderBoxComponent extends MapHeaderComponent<IVehicleLocation> {
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IVehicleLocation } from '@donmahallem/trapeze-api-types';
import { MapHeaderComponent } from './map-header.component';
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-vehicle-map-header',
    styleUrls: ['./map-header.component.scss'],
    templateUrl: './vehicle-map-header.component.pug',
})
export class VehicleMapHeaderBoxComponent extends MapHeaderComponent<IVehicleLocation> {
}

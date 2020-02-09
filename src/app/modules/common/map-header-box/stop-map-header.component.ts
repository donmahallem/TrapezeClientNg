import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IStopLocation, IStopPointLocation } from '@donmahallem/trapeze-api-types';
import { MapHeaderComponent } from './map-header.component';
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-stop-map-header',
    styleUrls: ['./map-header.component.scss'],
    templateUrl: './stop-map-header.component.pug',
})
export class StopMapHeaderComponent extends MapHeaderComponent<IStopLocation | IStopPointLocation> {
}

import { Directive, ElementRef, NgZone, OnDestroy } from '@angular/core';
import { IVehicleLocation, IVehiclePathInfo } from '@donmahallem/trapeze-api-types';
import { Map as OlMap } from 'ol';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { runOutsideZone } from 'src/app/rxjs-util/run-outside-zone';
import { SettingsService } from 'src/app/services/settings.service';
import { HeaderMapDirective } from './header-map.directive';
import { IStatus, VehicleMapHeaderService } from './vehicle-map-header.service';

/**
 * Directive displaying a map with the StopLocation
 */
@Directive({
    selector: 'map[appVehicleLocationHeader]',
})
export class VehicleLocationHeaderMapDirective extends HeaderMapDirective implements OnDestroy {

    private updateVehicleSubscription: Subscription;
    private updateRouteSubscription: Subscription;
    constructor(elRef: ElementRef,
                zone: NgZone,
                settingsService: SettingsService,
                public headerService: VehicleMapHeaderService) {
        super(elRef, zone, settingsService);
    }

    public updateVehicle(vehicle: IVehicleLocation): void {
    }

    public updateRoute(route: IVehiclePathInfo): void {
    }

    public onAfterSetView(map: OlMap): void {
        super.onAfterSetView(map);
        this.updateVehicleSubscription = this.headerService
            .createVehicleDataObservable()
            .pipe(tap((tapValue: IStatus) => {
                /**
                 * Required to set blur inside angular zone
                 */
                // tslint:disable-next-line:triple-equals
                this.blur = (tapValue.location == undefined);
            }), runOutsideZone(this.zone))
            .subscribe((loc: IStatus): void => {
                this.updateVehicle(loc.location);
                this.updateRoute(loc.route);
            });
    }
    public ngOnDestroy(): void {
        if (this.updateVehicleSubscription) {
            this.updateVehicleSubscription.unsubscribe();
        }
        if (this.updateRouteSubscription) {
            this.updateRouteSubscription.unsubscribe();
        }
        super.ngOnDestroy();
    }
}

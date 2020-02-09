import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    MatIconModule,
} from '@angular/material';
import { VehicleMapHeaderBoxComponent } from './vehicle-map-header.component';
import { VehicleLocationHeaderMapDirective } from './vehicle-location-header-map.directive';

@NgModule({
    declarations: [
        VehicleMapHeaderBoxComponent,
        VehicleLocationHeaderMapDirective,
    ],
    exports: [
        CommonModule,
        MatIconModule,
        VehicleMapHeaderBoxComponent,
    ],
    imports: [
        CommonModule,
        MatIconModule,
    ],
    providers: [
    ],
})
export class VehicleMapHeaderBoxModule { }

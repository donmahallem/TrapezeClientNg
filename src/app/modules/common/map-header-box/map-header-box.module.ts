import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    MatIconModule,
} from '@angular/material';
import { MapHeaderBoxComponent } from './map-header-box.component';
import { StopLocationMapDirective } from './stop-location-map.directive';

@NgModule({
    declarations: [
        MapHeaderBoxComponent,
        StopLocationMapDirective,
    ],
    exports: [
        CommonModule,
        MatIconModule,
        MapHeaderBoxComponent,
        StopLocationMapDirective,
    ],
    imports: [
        CommonModule,
        MatIconModule,
    ],
    providers: [
    ],
})
export class MapHeaderBoxModule { }

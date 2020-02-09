import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    MatIconModule,
} from '@angular/material';
import { StopMapHeaderComponent } from './stop-map-header.component';
import { StopLocationHeaderMapDirective } from './stop-location-header-map.directive';

@NgModule({
    declarations: [
        StopMapHeaderComponent,
        StopLocationHeaderMapDirective,
    ],
    exports: [
        CommonModule,
        MatIconModule,
        StopMapHeaderComponent,
    ],
    imports: [
        CommonModule,
        MatIconModule,
    ],
    providers: [
    ],
})
export class StopMapHeaderBoxModule { }

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
} from '@angular/material';
import { StopsInfoComponent } from './stops-info.component';
import { StopsRoutingModule } from './stops-routing.module';
import { StopsResolver } from './stops.resolver';

/**
 * Stops lazy loaded Module
 */
@NgModule({
    declarations: [
        StopsInfoComponent,
    ],
    imports: [
        StopsRoutingModule,
        CommonModule,
        MatIconModule,
        MatListModule,
        MatToolbarModule,
        MatProgressSpinnerModule,
        MatInputModule,
    ],
    providers: [
        StopsResolver,
    ],
})
export class StopsModule { }

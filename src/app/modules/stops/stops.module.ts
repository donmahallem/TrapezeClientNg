import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
} from '@angular/material';
import { RetryDialogModule } from '../common/retry-dialog';
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
        RetryDialogModule,
        MatDialogModule,
    ],
    providers: [
        StopsResolver,
    ],
})
export class StopsModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { TripPassagesComponent } from './trip.passages.component';
import { FollowBusMapComponent } from './follow-bus-map.component';
import { MatButtonModule } from '@angular/material/button';
import {
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatToolbarModule
} from '@angular/material';
const tripPassagesRoute: Routes = [
    {
        path: ':tripId',
        component: TripPassagesComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        MatListModule,
        MatButtonModule,
        MatToolbarModule,
        MatProgressSpinnerModule,
        RouterModule.forChild(tripPassagesRoute)
    ],
    declarations: [
        TripPassagesComponent,
        FollowBusMapComponent
    ],
    exports: [
        RouterModule
    ]
})
export class TripPassagesRoutingModule { }
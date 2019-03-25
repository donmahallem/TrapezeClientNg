import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
// import { TripPassagesComponent } from './trip.passages.component';
import { StopRoutingModule } from './stop-routing.module';
import {
    MatIconModule,
    MatListModule,
    MatTabsModule,
    MatToolbarModule,
    MatProgressSpinnerModule
} from '@angular/material';
import { StopInfoResolver } from './stop-info.resolver';
import { StopInfoComponent } from './stop-info.component';
import { DepartureListComponent } from './departure-list.component';
import { RouteListComponent } from './route-list.component';
@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        MatListModule,
        MatToolbarModule,
        MatProgressSpinnerModule,
        StopRoutingModule,
        MatTabsModule
    ],
    declarations: [
        StopInfoComponent,
        DepartureListComponent,
        RouteListComponent
    ],
    providers: [
        StopInfoResolver
    ]
})
export class StopModule { }

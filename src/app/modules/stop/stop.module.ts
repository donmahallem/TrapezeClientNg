import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
// import { TripPassagesComponent } from './trip.passages.component';
import { StopRoutingModule } from './stop-routing.module';
import {
    MatIconModule,
    MatListModule
} from '@angular/material';
import { StopInfoResolver } from './stop-info.resolver';
@NgModule({
    imports: [
        StopRoutingModule
    ],
    declarations: [
        // TripPassagesComponent
    ],
    providers: [
    ]
})
export class StopModule { }

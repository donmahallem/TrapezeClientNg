import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
//import { TripPassagesComponent } from './trip.passages.component';
import { TripPassagesRoutingModule } from './trip-passages-routing.module';
import {
    MatIconModule,
    MatListModule
} from '@angular/material';
@NgModule({
    imports: [
        TripPassagesRoutingModule
    ],
    declarations: [
        // TripPassagesComponent
    ]
})
export class TripPassagesModule { }
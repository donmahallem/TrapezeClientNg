import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
//import { TripPassagesComponent } from './trip.passages.component';
import { StopsRoutingModule } from './stops-routing.module';
import {
    MatIconModule,
    MatListModule
} from '@angular/material';
@NgModule({
    imports: [
        StopsRoutingModule
    ],
    declarations: [
        // TripPassagesComponent
    ]
})
export class StopsModule { }
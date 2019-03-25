import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { StopInfoComponent } from './stop-info.component';

import {
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatToolbarModule
} from '@angular/material';
import { StopInfoResolver } from './stop-info.resolver';
const tripPassagesRoute: Routes = [
    {
        path: ':stopId',
        component: StopInfoComponent,
        resolve: {
            stopInfo: StopInfoResolver
        }
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(tripPassagesRoute)
    ],
    exports: [
        RouterModule
    ]
})
export class StopRoutingModule { }

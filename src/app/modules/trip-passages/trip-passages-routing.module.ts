import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TripPassagesComponent } from './trip-passages.component';
import { TripPassagesResolver } from './trip-passages.resolver';

const tripPassagesRoute: Routes = [
    {
        component: TripPassagesComponent,
        data: {
            openSidebar: true,
        },
        path: ':tripId',
        resolve: {
            stopInfo: TripPassagesResolver,
        },
    },
];

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [
        RouterModule.forChild(tripPassagesRoute),
    ],
})
export class TripPassagesRoutingModule { }

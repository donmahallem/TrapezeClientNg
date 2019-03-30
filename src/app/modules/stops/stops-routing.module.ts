import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { StopsInfoComponent } from './stops-info.component';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';

const tripPassagesRoute: Routes = [
    {
        path: '',
        component: StopsInfoComponent,
        data: {
            openSidebar: true
        }
    }
];

@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        MatListModule,
        MatToolbarModule,
        MatProgressSpinnerModule,
        MatInputModule,
        RouterModule.forChild(tripPassagesRoute)
    ],
    declarations: [
        StopsInfoComponent
    ],
    exports: [
        RouterModule
    ]
})
export class StopsRoutingModule { }

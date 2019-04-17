import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Routes } from '@angular/router';
import { StopsInfoComponent } from './stops-info.component';
import { StopsResolver } from './stops.resolver';

const tripPassagesRoute: Routes = [
    {
        component: StopsInfoComponent,
        path: '',
        resolve: {
            stops: StopsResolver,
        },
    },
];

@NgModule({
    declarations: [
        StopsInfoComponent,
    ],
    exports: [
        RouterModule,
    ],
    imports: [
        CommonModule,
        MatIconModule,
        MatListModule,
        MatToolbarModule,
        MatProgressSpinnerModule,
        MatInputModule,
        RouterModule.forChild(tripPassagesRoute),
    ],
})
export class StopsRoutingModule { }

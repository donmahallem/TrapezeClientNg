import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found.component';

const tripPassagesRoute: Routes = [
    {
        component: NotFoundComponent,
        path: '**',
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
export class NotFoundRoutingModule { }

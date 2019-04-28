import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found.component';

const tripPassagesRoute: Routes = [
    {
        component: NotFoundComponent,
        path: 'not-found',
    },
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
export class ErrorRoutingModule { }

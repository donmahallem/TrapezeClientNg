import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found.component';
import { CommonErrorComponent } from './common-error.component';

const errorRoutes: Routes = [
    {
        component: CommonErrorComponent,
        path: '',
    },
    {
        component: NotFoundComponent,
        path: 'not-found',
    },
    {
        path: '**',
        redirectTo: 'not-found'
    },
];

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [
        RouterModule.forChild(errorRoutes),
    ],
})
export class ErrorRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './search.component';

const tripPassagesRoute: Routes = [
    {
        component: SearchComponent,
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
export class SearchRoutingModule { }

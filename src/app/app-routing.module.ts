import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
    {
        path: 'passages',
        loadChildren: './modules/trip-passages/trip-passages.module#TripPassagesModule',
    },
    {
        path: 'stop',
        loadChildren: './modules/stop/stop.module#StopModule',
    },
    {
        path: 'stops',
        loadChildren: './modules/stops/stops.module#StopsModule',
    }/*,
    { path: 'heroes', component: HeroListComponent },
    { path: '', redirectTo: '/heroes', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }*/
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes,
            { enableTracing: false } // <-- debugging purposes only
        )
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }
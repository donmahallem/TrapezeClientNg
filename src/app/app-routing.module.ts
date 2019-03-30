import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { of } from 'rxjs';

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
    }
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

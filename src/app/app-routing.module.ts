import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPreloadingStrategy } from './app-preloading-strategy';

const appRoutes: Routes = [
    {
        loadChildren: './modules/trip-passages/trip-passages.module#TripPassagesModule',
        path: 'passages',
    },
    {
        loadChildren: './modules/stop/stop.module#StopModule',
        path: 'stop',
    },
    {
        loadChildren: './modules/stops/stops.module#StopsModule',
        path: 'stops',
    },
    {
        loadChildren: './modules/not-found/not-found.module#NotFoundModule',
        path: 'not-found',
    },
    {
        children: [
        ],
        path: '',
    },
    {
        path: '**', redirectTo: '/not-found',
    },
];

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [
        RouterModule.forRoot(
            appRoutes,
            {
                enableTracing: false,
                preloadingStrategy: AppPreloadingStrategy,
            }, // <-- debugging purposes only
        ),
    ],
    providers: [AppPreloadingStrategy],
})
export class AppRoutingModule { }

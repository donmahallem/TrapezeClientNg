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
        loadChildren: './modules/error/error.module#ErrorModule',
        path: 'error',
    },
    {
        loadChildren: './modules/routing/search/search.module#SearchModule',
        path: 'search',
    },
    {
        children: [
        ],
        path: '',
    },
    {
        path: '**', redirectTo: '/error/not-found',
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

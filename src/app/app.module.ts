import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { MatIconModule, MatInputModule } from '@angular/material';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DrawableDirective } from './drawable.directive';
import { MainMapModule } from './modules/main-map';
import { MainToolbarModule } from './modules/main-toolbar/main-toolbar.module';
import { SidebarModule } from './modules/sidebar/sidebar.module';
import { SettingsService } from './services/settings.service';
import { StopPointService } from './services/stop-point.service';
import { UserLocationService } from './services/user-location.service';

export const SettingsInitializer = (appInitService: SettingsService) => {
    return (): Promise<any> => {
        return appInitService.load();
    };
};
const moduleImports: any[] = [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    AppRoutingModule,
    MatIconModule,
    MatInputModule,
    MainMapModule,
    MainToolbarModule,
    SidebarModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.production && environment.pwa === true,
    }),
];
@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        DrawableDirective,
    ],
    imports: moduleImports,
    providers: [
        StopPointService,
        UserLocationService,
        SettingsService,
        {
            deps: [SettingsService],
            multi: true,
            provide: APP_INITIALIZER,
            useFactory: SettingsInitializer,
        },
    ],
})
export class AppModule { }

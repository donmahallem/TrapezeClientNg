import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatIconModule, MatInputModule, MatSnackBarModule } from '@angular/material';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainMapDirective } from './components';
import { DrawableDirective } from './drawable.directive';
import { MainToolbarModule } from './modules/main-toolbar/main-toolbar.module';
import { SidebarModule } from './modules/sidebar/sidebar.module';
import { StopPointService } from './services/stop-point.service';
import { UserLocationService } from './services/user-location.service';
import { MainMapModule } from './modules/main-map';

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
    ],
})
export class AppModule { }

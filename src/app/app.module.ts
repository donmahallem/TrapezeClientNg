import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DrawableDirective } from './drawable.directive';
import { AppComponent } from './app.component';
import { MapComponent } from './components';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule, MatToolbarModule, MatIconModule, MatButtonModule, MatInputModule } from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MainToolbarComponent } from './main-toolbar.component';
@NgModule({
    declarations: [
        AppComponent,
        DrawableDirective,
        MapComponent,
        MainToolbarComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatSidenavModule,
        MatToolbarModule,
        AppRoutingModule,
        MatIconModule,
        MatButtonModule,
        MatInputModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }

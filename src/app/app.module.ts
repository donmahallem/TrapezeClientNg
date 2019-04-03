import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule, MatIconModule, MatInputModule, MatToolbarModule } from '@angular/material';
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
import { StopPointService } from './services/stop-point.service';
@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        DrawableDirective,
        MainMapDirective,
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
        MainToolbarModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    ],
    providers: [
        StopPointService,
    ],
})
export class AppModule { }

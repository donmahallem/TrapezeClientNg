import { NgModule } from '@angular/core';
// import { TripPassagesComponent } from './trip.passages.component';
import { StopsRoutingModule } from './stops-routing.module';
import { StopsResolver } from './stops.resolver';
@NgModule({
    declarations: [
        // TripPassagesComponent
    ],
    imports: [
        StopsRoutingModule,
    ],
    providers: [
        StopsResolver,
    ],
})
export class StopsModule { }

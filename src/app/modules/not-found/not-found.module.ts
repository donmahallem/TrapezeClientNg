import { NgModule } from '@angular/core';
import { NotFoundRoutingModule } from './not-found-routing.module';
import { NotFoundComponent } from './not-found.component';
import { CommonModule } from '@angular/common';
import {
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatInputModule
} from '@angular/material';
@NgModule({
    declarations: [
        NotFoundComponent
    ],
    imports: [
        NotFoundRoutingModule,
        CommonModule,
        MatIconModule,
        MatListModule,
        MatToolbarModule,
        MatProgressSpinnerModule,
        MatInputModule,
    ],
    providers: [
    ],
})
export class NotFoundModule { }

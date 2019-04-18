import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    MatListModule,
} from '@angular/material';
import { NotFoundRoutingModule } from './not-found-routing.module';
import { NotFoundComponent } from './not-found.component';
@NgModule({
    declarations: [
        NotFoundComponent,
    ],
    imports: [
        NotFoundRoutingModule,
        CommonModule,
        MatListModule,
    ],
    providers: [
    ],
})
export class NotFoundModule { }

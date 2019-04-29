import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    MatIconModule, MatListModule,
} from '@angular/material';
import { ErrorRoutingModule } from './error-routing.module';
import { NotFoundComponent } from './not-found.component';
import { CommonErrorComponent } from './common-error.component';
@NgModule({
    declarations: [
        NotFoundComponent,
        CommonErrorComponent
    ],
    imports: [
        ErrorRoutingModule,
        CommonModule,
        MatListModule,
        MatIconModule,
    ],
    providers: [
    ],
})
export class ErrorModule { }

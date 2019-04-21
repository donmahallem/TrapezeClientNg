import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    MatIconModule, MatListModule, MatSnackBarModule,
} from '@angular/material';
import { MainMapDirective } from './main-map.directive';
@NgModule({
    declarations: [
        MainMapDirective,
    ],
    imports: [
        MatSnackBarModule,
        CommonModule,
    ],
    exports: [
        CommonModule,
        MatSnackBarModule,
        MainMapDirective
    ]
})
export class MainMapModule { }

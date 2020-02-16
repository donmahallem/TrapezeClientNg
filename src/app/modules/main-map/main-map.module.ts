import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    MatSnackBarModule,
} from '@angular/material';
import { MainMapDirective } from './main-map.directive';
import { OlMainMapDirective } from './ol-main-map.directive';
@NgModule({
    declarations: [
        MainMapDirective,
        OlMainMapDirective,
    ],
    exports: [
        CommonModule,
        MatSnackBarModule,
        MainMapDirective,
        OlMainMapDirective,
    ],
    imports: [
        MatSnackBarModule,
        CommonModule,
    ],
})
export class MainMapModule { }

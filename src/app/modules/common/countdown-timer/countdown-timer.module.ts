import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    MatIconModule,
} from '@angular/material';
import { CountdownTimerDirective } from './countdown-timer.directive';

@NgModule({
    declarations: [
        CountdownTimerDirective,
    ],
    exports: [
        CommonModule,
        MatIconModule,
        CountdownTimerDirective,
    ],
    imports: [
        CommonModule,
        MatIconModule,
    ],
    providers: [
    ],
})
export class CountdownTimerModule { }

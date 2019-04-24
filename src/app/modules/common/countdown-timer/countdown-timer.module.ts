import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    MatIconModule,
} from '@angular/material';
import { CountdownTimerComponent } from './countdown-timer.component';

@NgModule({
    declarations: [
        CountdownTimerComponent,
    ],
    exports: [
        CommonModule,
        MatIconModule,
        CountdownTimerComponent,
    ],
    imports: [
        CommonModule,
        MatIconModule,
    ],
    providers: [
    ],
})
export class CountdownTimerModule { }

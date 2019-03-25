import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MatIconModule,
    MatToolbarModule,
    MatAutocompleteModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule
} from '@angular/material';
import { MainToolbarComponent } from './main-toolbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToolbarSearchBoxComponent } from './search-box.component';
import { RouteLoadingIndicatorComponent } from './route-loading-indicator.component';


@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        MatToolbarModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        FormsModule,
        MatInputModule,
        MatButtonModule,
        RouterModule,
        MatProgressBarModule
    ],
    declarations: [
        MainToolbarComponent,
        ToolbarSearchBoxComponent,
        RouteLoadingIndicatorComponent
    ],
    exports: [
        MainToolbarComponent,
        CommonModule,
        MatIconModule,
        MatToolbarModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        FormsModule,
        MatInputModule,
        MatButtonModule,
        RouterModule,
        ToolbarSearchBoxComponent,
        RouteLoadingIndicatorComponent,
        MatProgressBarModule
    ],
    providers: [
    ]
})
export class MainToolbarModule { }

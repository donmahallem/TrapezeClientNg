import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MatIconModule,
    MatToolbarModule,
    MatAutocompleteModule,
    MatInputModule,
    MatButtonModule
} from '@angular/material';
import { MainToolbarComponent } from './main-toolbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToolbarSearchBoxComponent } from './search-box.component';


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
        RouterModule
    ],
    declarations: [
        MainToolbarComponent,
        ToolbarSearchBoxComponent
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
        ToolbarSearchBoxComponent
    ],
    providers: [
    ]
})
export class MainToolbarModule { }

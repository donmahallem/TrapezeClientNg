import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { LoadedRouterConfig } from '@angular/router/src/config';
@Component({
    selector: 'app-not-found',
    styleUrls: ['./not-found.component.scss'],
    templateUrl: './not-found.component.pug',
})
export class NotFoundComponent {
    constructor(private router: Router) {
    }

}

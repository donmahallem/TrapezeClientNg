import { Component } from '@angular/core';
@Component({
    selector: 'app-not-found',
    styleUrls: ['./not-found.component.scss'],
    templateUrl: './not-found.component.pug',
})
export class NotFoundComponent {

    public readonly endpoints: {
        icon: string;
        path: string;
        title: string;
    }[] = [{
        icon: 'home',
        path: '/',
        title: 'Home',
    }, {
        icon: 'place',
        path: '/stops',
        title: 'Stops',
    }];
    constructor() {
    }

}

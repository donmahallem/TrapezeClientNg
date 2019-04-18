import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IStopLocation } from '@donmahallem/trapeze-api-types';
@Component({
    selector: 'app-not-found',
    styleUrls: ['./not-found.component.scss'],
    templateUrl: './not-found.component.pug',
})
export class NotFoundComponent {
    constructor(private activatedRoute: ActivatedRoute) {

    }

}

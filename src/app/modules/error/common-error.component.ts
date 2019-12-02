import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ErrorType } from './error-type';
@Component({
    selector: 'app-common-error',
    styleUrls: ['./common-error.component.scss'],
    templateUrl: './common-error.component.pug',
})
/**
 * Common Error component
 */
export class CommonErrorComponent {

}

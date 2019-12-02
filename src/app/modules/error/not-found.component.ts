import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ErrorType } from './error-type';
import { map } from 'rxjs/operators';
@Component({
    selector: 'app-not-found',
    styleUrls: ['./not-found.component.scss'],
    templateUrl: './not-found.component.pug',
})
/**
 * Component to be displayed for Errors with non found resources.
 * Offers links to common entry points
 */
export class NotFoundComponent {

    /**
     * List of entry points
     */
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
    public errorTypeObservable: Observable<string>;
    constructor(private route: ActivatedRoute) {
        this.errorTypeObservable = this.route.queryParams
            .pipe(map((value) => {
                if (value.type) {
                    return value.type;
                }
                return ErrorType.UNKNOWN;
            }));
    }
}

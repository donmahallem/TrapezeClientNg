import {
    ChangeDetectionStrategy,
    Component,
    Input,
} from '@angular/core';
import { ITripPassage } from '@donmahallem/trapeze-api-types';

/**
 * List of Departures Component
 */
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-trip-passages-list',
    styleUrls: ['./trip-passages-list.component.scss'],
    templateUrl: './trip-passages-list.component.pug',
})
export class TripPassagesListComponent {

    @Input()
    public passages: ITripPassage[];

    /**
     * Returns if the atleast one passages was provided
     * @returns true if there is atleast one departure
     */
    public hasPassages(): boolean {
        return Array.isArray(this.passages) && this.passages.length > 0;
    }

}

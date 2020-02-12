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

    private mPassages: ITripPassage[] = [];

    /**
     * set the passages
     */
    @Input('passages')
    public set passages(passages: ITripPassage[]) {
        this.mPassages = passages ? passages : [];
    }

    /**
     * passages
     */
    public get passages(): ITripPassage[] {
        return this.mPassages ? this.mPassages : [];
    }

    /**
     * Returns if the atleast one passages was provided
     * @returns true if there is atleast one departure
     */
    public hasPassages(): boolean {
        return this.mPassages !== undefined && this.mPassages.length > 0;
    }

}

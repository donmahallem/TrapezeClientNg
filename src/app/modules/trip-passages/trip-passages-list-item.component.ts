import {
    ChangeDetectionStrategy,
    Component,
    Input,
} from '@angular/core';
import { ITripPassage } from '@donmahallem/trapeze-api-types';
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-trip-passages-list-item',
    styleUrls: ['./trip-passages-list-item.component.scss'],
    templateUrl: './trip-passages-list-item.component.pug',
})
export class TripPassagesListItemComponent {

    /**
     * Object holding the current departure
     * Can be undefined
     */
    private mPassage: ITripPassage = undefined;
    /**
     * The time of arrival
     */
    private mTime = '';

    /**
     * Sets the departure
     * @param deps The departures
     */
    @Input('passage')
    public set passage(pass: ITripPassage) {
        this.mPassage = pass;
    }

    /**
     * gets the departure
     * @returns the departure or undefined
     */
    public get passage(): ITripPassage {
        return this.mPassage;
    }

    public get time(): string {
        return this.mTime;
    }
}

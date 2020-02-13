import {
    ChangeDetectionStrategy,
    Component,
    Input,
} from '@angular/core';
import { ITripPassage, ITripPassages } from '@donmahallem/trapeze-api-types';
import { TripInfoWithId } from 'src/app/services';

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
    public set tripInfo(info: TripInfoWithId) {
        const passages: ITripPassage[] = [...info.actual, ...info.old];
        passages.sort((a: ITripPassage, b: ITripPassage): number =>
            parseInt(b.stop_seq_num, 10) - parseInt(a.stop_seq_num, 10));
        this.passages = passages;
    }

    public passages: ITripPassage[] = [];

    /**
     * Returns if the atleast one passages was provided
     * @returns true if there is atleast one departure
     */
    public hasPassages(): boolean {
        return Array.isArray(this.passages) && this.passages.length > 0;
    }

}

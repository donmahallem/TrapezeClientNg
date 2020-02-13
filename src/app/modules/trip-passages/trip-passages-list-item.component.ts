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
    @Input()
    public passage: ITripPassage;

}

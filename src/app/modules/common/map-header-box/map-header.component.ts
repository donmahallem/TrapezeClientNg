import { HostBinding, Input } from '@angular/core';

export abstract class MapHeaderComponent {

    @HostBinding('class.no-location')
    public blur: boolean = false;

    @Input()
    public lastUpdate: Date = undefined;
    /**
     * Title being displayed
     */
    public abstract get title(): string;
}

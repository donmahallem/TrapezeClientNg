import { Injectable } from '@angular/core';
import { ISettings } from '@donmahallem/trapeze-api-types';
import * as L from 'leaflet';
import { of, BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ApiService } from './api.service';

export class SettingsLoadSubscriber extends Subscriber<void> {
    public constructor(private resolve: (arg: void) => void) {
        super();
    }

    public error(err: any): void {
        this.resolve();
        // tslint:disable-next-line:no-console
        console.error(err);
    }

    public complete(): void {
        this.resolve();
    }
}

@Injectable(
    { providedIn: 'root' },
)
export class SettingsService {

    private settingsSubject: BehaviorSubject<ISettings> = new BehaviorSubject(undefined);

    constructor(private apiService: ApiService) {

    }

    public get settings(): ISettings {
        return this.settingsSubject.value;
    }

    public getInitialMapCenter(): L.LatLng {
        if (this.settings) {
            return new L.LatLng(this.settings.INITIAL_LAT / 3600000, this.settings.INITIAL_LON / 3600000);
        }
        return new L.LatLng(0, 0);
    }
    public getInitialMapZoom(): number {
        if (this.settings) {
            return this.settings.INITIAL_ZOOM;
        }
        return 5000;
    }

    public load(): Promise<void> {
        return new Promise((resolve: (arg: void) => void, reject: (err: any) => void) => {
            return this.apiService.getSettings()
                .pipe(tap((value: ISettings): void => {
                    this.settingsSubject.next(value);
                }),
                    map((value: ISettings): void => {
                        return;
                    }),
                    catchError((err: any): Observable<any> => {
                        return of(undefined);
                    }))
                .subscribe(new SettingsLoadSubscriber(resolve));
        });
    }
}

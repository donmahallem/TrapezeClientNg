import { Injectable } from '@angular/core';
import { ISettings } from '@donmahallem/trapeze-api-types';
import * as L from 'leaflet';
import { BehaviorSubject, EMPTY, Observable, Subscriber } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiService } from './api.service';

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

    load() {
        return new Promise((resolve, reject) => {
            return this.apiService.getSettings()
                .pipe(tap((value: ISettings): void => {
                    this.settingsSubject.next(value);
                }),
                    catchError((err: any): Observable<any> => {
                        return EMPTY;
                    }))
                .subscribe(new Subscriber(resolve.bind(this), reject.bind(this)));
        });
    }
}

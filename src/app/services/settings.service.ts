import { Injectable } from '@angular/core';
import { ISettings } from '@donmahallem/trapeze-api-types';
import { BehaviorSubject, Subscriber } from 'rxjs';
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

    load() {
        return new Promise((resolve, reject) => {
            return this.apiService.getSettings()
                .subscribe(new Subscriber(resolve.bind(this), reject.bind(this)));
        });
    }
}

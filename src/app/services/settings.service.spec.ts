import { async, TestBed } from '@angular/core/testing';
import { SettingsService } from './settings.service';
// import * as sinon from "sinon";
describe('src/app/services/settings.service', () => {
    describe('SettingsService', () => {
        let sidebarService: SettingsService;
        beforeAll(() => {
        });
        beforeEach(async(() => {
            TestBed.configureTestingModule({
                providers: [SettingsService],
            });
            sidebarService = TestBed.get(SettingsService);
        }));

        afterEach(() => {
        });

        it('needs to be implemented');
    });
});

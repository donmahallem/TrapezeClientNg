import { async, TestBed } from '@angular/core/testing';
import { throwError, EMPTY } from 'rxjs';
import { ApiService } from './api.service';
import { SettingsService } from './settings.service';
// import * as sinon from "sinon";

describe('src/app/services/settings.service', () => {
    describe('SettingsService', () => {
        let settingsService: SettingsService;
        let getSettingsSpy: jasmine.Spy<InferableFunction>;
        beforeAll(() => {
            getSettingsSpy = jasmine.createSpy();
        });
        beforeEach(async(() => {
            TestBed.configureTestingModule({
                providers: [
                    SettingsService,
                    {
                        provide: ApiService,
                        useValue: {
                            getSettings: getSettingsSpy,
                        },
                    },
                ],
            });
            settingsService = TestBed.get(SettingsService);
        }));

        afterEach(() => {
            getSettingsSpy.calls.reset();
        });

        describe('load()', () => {
            describe('should resolve on error in observable', () => {
                beforeEach(() => {
                    getSettingsSpy.and.returnValue(throwError(false));
                });
                it('should resolve', (done) => {
                    settingsService.load()
                        .then((result) => {
                            expect(getSettingsSpy.call.length).toEqual(1);
                            expect(result).toEqual(undefined);
                            done();
                        })
                        .catch(done);
                });
            });

            describe('should resolve on complete in observable', () => {
                beforeEach(() => {
                    getSettingsSpy.and.returnValue(EMPTY);
                });
                it('should resolve', (done) => {
                    settingsService.load()
                        .then((result) => {
                            expect(getSettingsSpy.call.length).toEqual(1);
                            expect(result).toEqual(undefined);
                            done();
                        })
                        .catch(done);
                });
            });

        });
    });
});

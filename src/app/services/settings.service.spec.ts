import { async, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
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
        describe('settings', () => {
            describe('getter', () => {
                it('should return private mSettings', () => {
                    const testValue: any = {
                        test1: true,
                        test2: false,
                    };
                    (<any>settingsService).mSettings = testValue;
                    expect(settingsService.settings).toEqual(testValue);
                });
            });
        });
        describe('getInitialMapZoom()', () => {
            const testValues: {
                inp: {
                    lat?: number,
                    lon?: number,
                },
                out: {
                    lat: number,
                    lon: number,
                },
            }[] = [{
                inp: {},
                out: {
                    lat: 0,
                    lon: 0,
                },
            }];
            testValues.forEach((testValue) => {
                it('needs to be implemented');
            });
        });
        describe('getInitialMapZoom()', () => {
            const testValues: {
                settings: boolean,
                value?: number,
            }[] = [];
            testValues.forEach((testValue) => {
                it('should return zoom level ' + (testValue.value ? testValue.value : 20), () => {
                    if (testValue.settings === true) {
                        (<any>settingsService).mSettings = {
                            INITIAL_ZOOM: testValue.value,
                        };
                        expect(settingsService.getInitialMapZoom()).toEqual(testValue.value ? testValue.value : 20);
                    } else {
                        (<any>settingsService).mSettings = undefined;
                        expect(settingsService.getInitialMapZoom()).toEqual(20);
                    }
                });
            });
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
                            expect((<any>settingsService).mSettings).not.toBeDefined();
                            done();
                        })
                        .catch(done);
                });
            });

            describe('should resolve on complete in observable', () => {
                const testValue: any = {
                    test: true,
                    test1: 2,
                };
                beforeEach(() => {
                    getSettingsSpy.and.returnValue(of(testValue));
                });
                it('should resolve', (done) => {
                    settingsService.load()
                        .then((result) => {
                            expect(getSettingsSpy.call.length).toEqual(1);
                            expect(result).toEqual(undefined);
                            expect((<any>settingsService).mSettings).toEqual(testValue);
                            done();
                        })
                        .catch(done);
                });
            });

        });
    });
});

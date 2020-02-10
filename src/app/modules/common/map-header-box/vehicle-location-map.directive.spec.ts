import { Component, Injectable } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import * as L from 'leaflet';
import { SettingsService } from 'src/app/services/settings.service';
import { VehicleLocationHeaderMapDirective } from './vehicle-location-map.directive';

// tslint:disable:component-selector
// tslint:disable:directive-selector
@Component({
    selector: 'mat-divider',
    template: '<div></div>',
})
export class TestMatDividerComponent {
}

@Component({
    selector: 'mat-list-item',
    template: '<div></div>',
})
export class TestMatListItemComponent {
}

@Component({
    template: '<map appVehicleLocationHeader></map>',
})
export class TestParentComponent {
}

@Injectable()
export class TestSettingsService {
    public getInitialMapCenter(): L.LatLng {
        return L.latLng(0, 0);
    }
    public getInitialMapZoom(): number {
        return 13;
    }
}
// tslint:enable:component-selector
// tslint:enable:directive-selector

describe('src/modules/common/map-header-box/vehicle-location-map.directive.ts', () => {
    describe('VehicleLocationHeaderMapDirective', () => {
        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [
                    VehicleLocationHeaderMapDirective,
                    TestMatDividerComponent,
                    TestMatListItemComponent,
                    TestParentComponent,
                ],
                imports: [
                    RouterTestingModule,
                ],
                providers: [
                    {
                        provide: SettingsService,
                        useClass: TestSettingsService,
                    },
                ],
            }).compileComponents();
        }));

        beforeEach(() => {
            // testUploadDataService.
        });
        describe('as child element', () => {
            let fixture: ComponentFixture<TestParentComponent>;
            let component: TestParentComponent;
            let routeListCmp: VehicleLocationHeaderMapDirective;
            beforeEach(() => {
                fixture = TestBed.createComponent(TestParentComponent);
                component = fixture.debugElement.componentInstance;
                routeListCmp = fixture.debugElement.query(By.directive(VehicleLocationHeaderMapDirective)).componentInstance;
            });
            it('should create the components', () => {
                expect(component).toBeTruthy();
                expect(routeListCmp).toBeTruthy();
            });
            describe('test the "routes" input', () => {
                const testItem: any[] = [
                    {
                        directions: [
                            'test direction 1',
                            'test direction 2',
                        ],
                        shortName: '123',
                    },
                    {
                        directions: [
                            'other test direction 1',
                            'other test direction 2',
                        ],
                        shortName: '421',
                    },
                ];
                it('should set the testitem correctly as the input element', () => {
                    fixture.detectChanges();
                });
            });
        });
        beforeAll(() => { });
        afterEach(() => { });
    });
});

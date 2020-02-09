import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
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
    selector: 'mat-list',
    template: '<div></div>',
})
export class TestMatListComponent {
}

@Component({
    template: '<map appVehicleLocationHeader></map>',
})
export class TestParentComponent {
    public testData: any[];
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
                    TestMatListComponent,
                    TestParentComponent,
                ],
                imports: [
                    RouterTestingModule,
                ],
                providers: [
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
                    component.testData = testItem;
                    fixture.detectChanges();
                });
            });
        });
        beforeAll(() => { });
        afterEach(() => { });
    });
});

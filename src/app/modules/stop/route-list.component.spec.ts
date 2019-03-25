import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatButtonModule, } from '@angular/material';
import { Injectable, Component, Input } from '@angular/core';
import { RouteListComponent } from './route-list.component';
import { By } from '@angular/platform-browser';


/* tslint:disable */
@Component({
    selector: 'mat-divider',
    template: '<div></div>'
})
export class TestMatDivider {
}

@Component({
    selector: 'mat-list-item',
    template: '<div></div>'
})
export class TestMatListItem {
}

@Component({
    selector: 'mat-list',
    template: '<div></div>'
})
export class TestMatList {
}

@Component({
    template: '<app-route-list [routes]="testData"></app-route-list>'
})
export class TestParent {
    public testData: any[];
}


/* tslint:enable */



describe('src/modules/stop/route-list.component.ts', () => {
    describe('RouteListComponent', () => {
        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [
                    RouterTestingModule,
                    MatButtonModule
                ],
                declarations: [
                    RouteListComponent,
                    TestMatDivider,
                    TestMatListItem,
                    TestMatList,
                    TestParent
                ],
                providers: [
                ]
            }).compileComponents();
        }));

        beforeEach(() => {
            // testUploadDataService.
        });
        describe('as child element', () => {
            let fixture: ComponentFixture<TestParent>;
            let component: TestParent;
            let routeListCmp: RouteListComponent;
            beforeEach(() => {
                fixture = TestBed.createComponent(TestParent);
                component = fixture.debugElement.componentInstance;
                routeListCmp = fixture.debugElement.query(By.directive(RouteListComponent)).componentInstance;
            });
            it('should create the components', () => {
                expect(component).toBeTruthy();
                expect(routeListCmp).toBeTruthy();
            });
            describe('test the "routes" input', () => {
                const testItem: any[] = [
                    {
                        shortName: '123',
                        directions: [
                            'test direction 1',
                            'test direction 2'
                        ]
                    },
                    {
                        shortName: '421',
                        directions: [
                            'other test direction 1',
                            'other test direction 2'
                        ]
                    }
                ];
                it('should set the testitem correctly as the input element', () => {
                    component.testData = testItem;
                    fixture.detectChanges();
                    expect(routeListCmp.routes)
                        .toEqual(testItem);
                });
            });
        });
        beforeAll(() => { });
        afterEach(() => { });
    });
});

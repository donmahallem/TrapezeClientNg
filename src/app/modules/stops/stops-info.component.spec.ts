import { Component } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { StopsInfoComponent } from './stops-info.component';

// tslint:disable:component-selector
// tslint:disable:directive-selector
@Component({
    selector: 'mat-nav-list',
    template: '<div></div>',
})
export class TestMatListComponent {
}
@Component({
    selector: 'mat-list-item',
    template: '<div></div>',
})
export class TestMatListItemComponent {
}
@Component({
    selector: 'mat-divider',
    template: '<div></div>',
})
export class TestMatDividerComponent {
}

// tslint:enable:component-selector
// tslint:enable:directive-selector

describe('src/modules/stops/stops-info.component.ts', () => {
    describe('StopsInfoComponent', () => {
        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [
                    StopsInfoComponent,
                    TestMatListComponent,
                    TestMatDividerComponent,
                    TestMatListItemComponent,
                ],
                imports: [
                    RouterTestingModule,
                ],
                providers: [
                    {
                        provide: ActivatedRoute,
                        useValue: {
                            snapshot: {
                                data: {
                                    stops: {
                                        stops: [
                                            { name: 'a' },
                                            { name: 'b' }],
                                    },
                                },
                            },
                        },
                    },
                ],
            }).compileComponents();
        }));

        it('should create the app', async(() => {
            const fixture = TestBed.createComponent(StopsInfoComponent);
            const app = fixture.debugElement.componentInstance;
            expect(app).toBeTruthy();
        }));
    });
});

import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NotFoundComponent } from './not-found.component';

// tslint:disable:component-selector
// tslint:disable:directive-selector
@Component({
    selector: 'mat-icon',
    template: '<div></div>',
})
class TestMatIconComponent {
}
@Component({
    selector: 'mat-list-item',
    template: '<div></div>',
})
class TestMatListItemComponent {
}
@Component({
    selector: 'mat-nav-list',
    template: '<div></div>',
})
class TestMatNavListComponent {
}
@Component({
    selector: 'app-not-found-msg-switch',
    template: '<div></div>',
})
class TestNotFoundMessageSwitchComponent {
}

// tslint:enable:component-selector
// tslint:enable:directive-selector

describe('src/modules/error/not-found.component.ts', () => {
    describe('NotFoundComponent', () => {
        let cmpFixture: ComponentFixture<NotFoundComponent>;
        let cmp: NotFoundComponent;
        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [
                    NotFoundComponent,
                    TestMatIconComponent,
                    TestMatListItemComponent,
                    TestMatNavListComponent,
                    TestNotFoundMessageSwitchComponent,
                ],
                imports: [
                    RouterTestingModule,
                ],
                providers: [],
            }).compileComponents();
            cmpFixture = TestBed.createComponent(NotFoundComponent);
            cmp = cmpFixture.debugElement.componentInstance;
        }));
        it('should create the app', async(() => {
            expect(cmp).toBeTruthy();
        }));

    });
});

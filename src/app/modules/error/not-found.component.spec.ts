import { Component, DebugElement, Injectable } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { ErrorType } from './error-type';
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

@Injectable()
class TestActivatedRoute {
    public queryParams: BehaviorSubject<{
        type?: any;
    }> = new BehaviorSubject({});
}

// tslint:enable:component-selector
// tslint:enable:directive-selector

describe('src/modules/error/not-found.component.ts', () => {
    describe('NotFoundComponent', () => {
        let cmpFixture: ComponentFixture<NotFoundComponent>;
        let cmp: NotFoundComponent;
        let testActivatedRoute: TestActivatedRoute;
        let infoBoxDebugElement: DebugElement;
        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [
                    NotFoundComponent,
                    TestMatIconComponent,
                    TestMatListItemComponent,
                    TestMatNavListComponent,
                ],
                imports: [
                    RouterTestingModule,
                ],
                providers: [
                    { provide: ActivatedRoute, useClass: TestActivatedRoute },
                ],
            }).compileComponents();
            cmpFixture = TestBed.createComponent(NotFoundComponent);
            cmp = cmpFixture.debugElement.componentInstance;
            testActivatedRoute = TestBed.get(ActivatedRoute);
            infoBoxDebugElement = cmpFixture.debugElement.query(By.css('div.info'));
        }));
        it('should create the app', async(() => {
            expect(cmp).toBeTruthy();
            expect(infoBoxDebugElement.componentInstance).toBeTruthy();
        }));

        describe('error type is provided', () => {
            describe('error type is ' + ErrorType.NotFoundPassage, () => {
                beforeEach(() => {
                    testActivatedRoute.queryParams.next({
                        type: ErrorType.NotFoundPassage,
                    });
                    cmpFixture.detectChanges();
                });
                it('should only display that the passage could not be found', () => {
                    expect(infoBoxDebugElement.nativeElement.textContent).toEqual('The passage could not be found. It either expired or has yet to start.Please select another passage.');
                });
            });
            describe('error type is ' + ErrorType.NotFoundVehicle, () => {
                beforeEach(() => {
                    testActivatedRoute.queryParams.next({
                        type: ErrorType.NotFoundVehicle,
                    });
                    cmpFixture.detectChanges();
                });
                it('should only display that the vehicle could not be found', () => {
                    expect(infoBoxDebugElement.nativeElement.textContent).toEqual('The requested vehicle could not be found. It might not be active at the moment.');
                });
            });
            describe('error type is an unsupported value', () => {
                beforeEach(() => {
                    testActivatedRoute.queryParams.next({
                        type: -100,
                    });
                    cmpFixture.detectChanges();
                });
                it('should only display that the requested resource could not be found', () => {
                    expect(infoBoxDebugElement.nativeElement.textContent).toEqual('The requested resource can not be found.');
                });
            });
        });
    });
});

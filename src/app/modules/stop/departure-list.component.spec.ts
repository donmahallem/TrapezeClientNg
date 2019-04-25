import { Component, Directive, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IDeparture } from '@donmahallem/trapeze-api-types';
import { DepartureListComponent } from './departure-list.component';

// tslint:disable:component-selector
// tslint:disable:directive-selector
@Component({
  selector: 'mat-nav-list',
  template: '<div></div>',
})
export class TestMatNavListComponent {
}
@Component({
  selector: 'app-departure-list-item',
  template: '<div></div>',
})
export class TestDepartureListItemComponent {
  @Input()
  public departure: IDeparture;
}

@Directive({
  selector: 'a[routerLink]',
})
export class TestRouterLinkDirective {
  @Input()
  public routerLink: string;
}

// tslint:enable:component-selector
// tslint:enable:directive-selector
describe('src/app/modules/stop/departure-list.component', () => {
  describe('DepartureListComponent', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [
          DepartureListComponent,
          TestMatNavListComponent,
          TestDepartureListItemComponent,
          TestRouterLinkDirective,
        ],
      }).compileComponents();
    }));
    it('should create the app', async(() => {
      const fixture = TestBed.createComponent(DepartureListComponent);
      const app = fixture.debugElement.componentInstance;
      expect(app).toBeTruthy();
    }));
    describe('layout', () => {
      it('needs to be implemented');
    });
    describe('Component methods and attributes', () => {
      let fixture: ComponentFixture<DepartureListComponent>;
      let cmp: DepartureListComponent;
      beforeEach(() => {
        fixture = TestBed.createComponent(DepartureListComponent);
        cmp = fixture.debugElement.componentInstance;
      });
      const testPassages: any[] = [
        [{ test: true }], [{ test: false }],
      ];
      describe('departures', () => {
        describe('getter', () => {
          testPassages.forEach((testPassage) => {
            it('should get the correct value', () => {
              (<any>cmp).mDepartures = testPassage;
              expect(cmp.departures).toEqual(testPassage);
            });
          });
        });
        describe('setter', () => {
          testPassages.forEach((testPassage) => {
            it('should set the correct value', () => {
              cmp.departures = testPassage;
              expect((<any>cmp).mDepartures).toEqual(testPassage);
            });
          });
        });
      });
    });
  });
});

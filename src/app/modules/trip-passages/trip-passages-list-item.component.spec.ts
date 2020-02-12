import { Component, Input } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { IDeparture } from '@donmahallem/trapeze-api-types';
import { TripPassagesListItemComponent } from './trip-passages-list-item.component';
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

// tslint:enable:component-selector
// tslint:enable:directive-selector
describe('src/app/modules/trip-passages/trip-passages-list-item.component', () => {
  describe('TripPassagesListItemComponent', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [
          TripPassagesListItemComponent,
          TestMatNavListComponent,
          TestDepartureListItemComponent,
        ],
      }).compileComponents();
    }));
    it('should create the app', async(() => {
      const fixture = TestBed.createComponent(TripPassagesListItemComponent);
      const app = fixture.debugElement.componentInstance;
      expect(app).toBeTruthy();
    }));
    describe('layout', () => {
      it('needs to be implemented');
    });
  });
});

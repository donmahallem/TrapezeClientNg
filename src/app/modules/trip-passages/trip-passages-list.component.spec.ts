import { Component, Input } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { IDeparture } from '@donmahallem/trapeze-api-types';
import { TripPassagesListComponent } from './trip-passages-list.component';

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
describe('src/app/modules/trip-passages/trip-passages-list.component', () => {
  describe('TripPassagesListComponent', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [
          TripPassagesListComponent,
          TestMatNavListComponent,
          TestDepartureListItemComponent,
        ],
      }).compileComponents();
    }));
    it('should create the app', async(() => {
      const fixture = TestBed.createComponent(TripPassagesListComponent);
      const app = fixture.debugElement.componentInstance;
      expect(app).toBeTruthy();
    }));
    describe('layout', () => {
      it('needs to be implemented');
    });
  });
});

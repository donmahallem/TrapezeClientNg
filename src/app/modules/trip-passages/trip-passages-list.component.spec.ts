import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ITripPassage, StopId, StopShortName } from '@donmahallem/trapeze-api-types';
import { VEHICLE_STATUS } from '@donmahallem/trapeze-api-types/dist/vehicle-status';
import { TripPassagesListComponent } from './trip-passages-list.component';

// tslint:disable:component-selector
// tslint:disable:directive-selector
@Component({
  selector: 'mat-nav-list',
  template: '<ng-content></ng-content>',
})
export class TestMatNavListComponent {
}
@Component({
  selector: 'app-trip-passages-list-item',
  template: '<p>list-item</p>',
})
export class TestTripPassagesListItemComponent {
  @Input()
  public passage: ITripPassage;
}

@Component({
  template: '<app-trip-passages-list [passages]="testPassages"></app-trip-passages-list>',
})
export class TestParentComponent {
  public testPassages: ITripPassage[];
}
// tslint:enable:component-selector
// tslint:enable:directive-selector
const testPassages: ITripPassage[] = [{
  actualTime: '12:20',
  status: VEHICLE_STATUS.DEPARTED,
  stop: {
    id: 'anyid1' as StopId,
    name: 'anystop1',
    shortName: 'anyStopName1' as StopShortName,
  },
  stop_seq_num: '1',
}, {
  actualTime: '15:30',
  status: VEHICLE_STATUS.PLANNED,
  stop: {
    id: 'anyid2' as StopId,
    name: 'anystop2',
    shortName: 'anyStopName2' as StopShortName,
  },
  stop_seq_num: '2',
}, {
  actualTime: '09:30',
  status: VEHICLE_STATUS.STOPPING,
  stop: {
    id: 'anyid3' as StopId,
    name: 'anystop3',
    shortName: 'anyStopName3' as StopShortName,
  },
  stop_seq_num: '3',
}];
describe('src/app/modules/trip-passages/trip-passages-list.component', () => {
  describe('TripPassagesListComponent', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [
          TripPassagesListComponent,
          TestMatNavListComponent,
          TestTripPassagesListItemComponent,
          TestParentComponent,
        ],
      }).overrideComponent(TripPassagesListComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      }).compileComponents();
    }));
    describe('methods', () => {
      let cmpFixture: ComponentFixture<TripPassagesListComponent>;
      let cmp: TripPassagesListComponent;
      beforeEach(() => {
        cmpFixture = TestBed.createComponent(TripPassagesListComponent);
        cmp = cmpFixture.componentInstance;
      });
      describe('hasPassages()', () => {
        // tslint:disable-next-line:no-null-keyword
        [undefined, null, [], 1, 'k'].forEach((testValue: any) => {
          it('should return false for passages being "' + testValue + '"', () => {
            cmp.passages = testValue;
            expect(cmp.hasPassages()).toBeFalse();
          });
        });
        [[1], [1, 2]].forEach((testValue: any[]) => {
          it('should return true for ' + testValue.length + ' set passages', () => {
            cmp.passages = testValue;
            expect(cmp.hasPassages()).toBeTrue();
          });
        });
      });
    });
    describe('without parent element', () => {
      let cmpFixture: ComponentFixture<TripPassagesListComponent>;
      let cmp: TripPassagesListComponent;
      beforeEach(() => {
        cmpFixture = TestBed.createComponent(TripPassagesListComponent);
        cmp = cmpFixture.componentInstance;
      });
      describe('with passages set', () => {
        let listItems: TestTripPassagesListItemComponent[];
        let bodyText: string;
        [1, 2, 3].forEach((testNum: number): void => {

          it('should display ' + testNum + ' all relavent items', () => {
            cmp.passages = testPassages.slice(0, testNum);
            cmpFixture.detectChanges();
            listItems = cmpFixture.debugElement
              .queryAll(By.directive(TestTripPassagesListItemComponent))
              .map((val) => val.componentInstance);
            bodyText = cmpFixture.debugElement.nativeElement.innerText;
            expect(bodyText).not.toEqual('No Passages');
            expect(listItems.length).toEqual(testNum);
            const mappedValues: ITripPassage[] = listItems
              .map((itemCmp: TestTripPassagesListItemComponent): ITripPassage =>
                itemCmp.passage);
            expect(mappedValues).toEqual(testPassages.slice(0, testNum));

          });
        });
      });
      describe('without passages set', () => {
        let listItems: TestTripPassagesListItemComponent[];
        let bodyText: string;
        [undefined, []].forEach((testItem: any): void => {

          it('should display "no passages" disclaimer', () => {
            cmp.passages = testItem;
            cmpFixture.detectChanges();
            listItems = cmpFixture.debugElement
              .queryAll(By.directive(TestTripPassagesListItemComponent))
              .map((val) => val.componentInstance);
            bodyText = cmpFixture.debugElement.nativeElement.innerText;
            expect(bodyText).toEqual('No Passages');
            expect(listItems.length).toEqual(0);
          });
        });
      });
    });
    describe('with parent element', () => {
      let parentFixture: ComponentFixture<TestParentComponent>;
      let parentCmp: TestParentComponent;
      let cmp: TripPassagesListComponent;
      beforeEach(() => {
        parentFixture = TestBed.createComponent(TestParentComponent);
        parentCmp = parentFixture.componentInstance;
        cmp = parentFixture.debugElement.query(By.directive(TripPassagesListComponent)).componentInstance;
        parentCmp.testPassages = undefined;
        parentFixture.detectChanges();
      });
      it('should set the elements via the Input tag', () => {
        expect(cmp.passages).toBeUndefined();
        parentCmp.testPassages = testPassages;
        parentFixture.detectChanges();
        expect(cmp.passages).toEqual(testPassages);
      });
    });
  });
});

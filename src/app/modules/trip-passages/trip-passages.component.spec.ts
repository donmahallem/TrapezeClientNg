import { ChangeDetectionStrategy, Component, DebugElement, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ITripPassage, ITripPassages, StopId, StopShortName, TripId } from '@donmahallem/trapeze-api-types';
import { VEHICLE_STATUS } from '@donmahallem/trapeze-api-types/dist/vehicle-status';
import { Subject } from 'rxjs';
import { TripPassagesListComponent } from './trip-passages-list.component';
import { TestTripPassagesListItemComponent } from './trip-passages-list.component.spec';
import { TripPassagesComponent } from './trip-passages.component';
import { TripPassagesService } from './trip-passages.service';
import { IPassageStatus, UpdateStatus } from './trip-util';

// tslint:disable:component-selector
// tslint:disable:directive-selector
@Component({
  selector: 'app-vehicle-map-header',
  template: '<div></div>',
})
export class TestVehicleMapHeaderComponent {
  @Input()
  public passages: ITripPassages;
}
@Component({
  selector: 'app-trip-passages-list',
  template: '<div></div>',
})
export class TestTripPassagesListComponent {
  @Input()
  public tripInfo: ITripPassages;
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
describe('src/app/modules/trip-passages/trip-passage.component', () => {
  describe('TripPassagesComponent', () => {
    const testStatusSubject: Subject<IPassageStatus> = new Subject();
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [
          TripPassagesComponent,
          TestTripPassagesListComponent,
          TestVehicleMapHeaderComponent,
        ],
        providers: [
          {
            provide: TripPassagesService,
            useValue: {
              statusObservable: testStatusSubject,
            },
          },
        ],
      }).overrideProvider(TripPassagesService, {
        useValue: {
          statusObservable: testStatusSubject,
        },
      }).compileComponents();
    }));
    let cmpFixture: ComponentFixture<TripPassagesComponent>;
    let cmp: TripPassagesComponent;
    beforeEach(() => {
      cmpFixture = TestBed.createComponent(TripPassagesComponent);
      cmp = cmpFixture.componentInstance;
    });
    describe('with status set', () => {
      let listDebugElement: DebugElement;
      let mapHeaderDebugElement: DebugElement;
      let notFoundDebugElement: DebugElement;
      const testStatus: IPassageStatus = {
        failures: 0,
        tripInfo: { test: true } as any,
        status: UpdateStatus.LOADED,
        timestamp: Date.now(),
        tripId: 'tripId' as TripId,
      };
      beforeEach(() => {
        cmpFixture.detectChanges();
        testStatusSubject.next(testStatus);
        cmpFixture.detectChanges();
        listDebugElement = cmpFixture.debugElement
          .query(By.directive(TestTripPassagesListComponent));
        mapHeaderDebugElement = cmpFixture.debugElement
          .query(By.directive(TestVehicleMapHeaderComponent));
        notFoundDebugElement = cmpFixture.debugElement
          .query(By.css('div.not-found'));
      });
      it('should display "no passages" disclaimer', () => {
        expect(listDebugElement).toBeDefined();
        expect(mapHeaderDebugElement).toBeDefined();
        expect(notFoundDebugElement).toBeNull();
        const listCmp: TestTripPassagesListComponent = listDebugElement.componentInstance;
        const mapHeaderCmp: TestVehicleMapHeaderComponent = mapHeaderDebugElement.componentInstance;
        expect(listCmp.tripInfo).toEqual(testStatus.tripInfo);
        expect(mapHeaderCmp.passages).toEqual(testStatus.tripInfo);
      });
    });
    describe('with no status emitted', () => {
      it('should display no content', () => {
        cmpFixture.detectChanges();
        expect(cmpFixture.debugElement.nativeElement.innerText).toEqual('');
      });
    });
  });
});

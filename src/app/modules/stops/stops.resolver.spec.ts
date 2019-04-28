import { HttpErrorResponse } from '@angular/common/http';
import { async, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { ApiService } from 'src/app/services';
import { StopsResolver } from './stops.resolver';

class TestMatDialog {

}
// import * as sinon from "sinon";
describe('src/app/modules/stops/stops.resolver', () => {
    describe('StopsResolver', () => {
        let resolver: StopsResolver;
        let getSpy: jasmine.Spy<InferableFunction>;
        let navigateSpy: jasmine.Spy<InferableFunction>;
        let nextSpy: jasmine.Spy<InferableFunction>;
        let errorSpy: jasmine.Spy<InferableFunction>;
        beforeAll(() => {
            getSpy = jasmine.createSpy();
            navigateSpy = jasmine.createSpy();
            nextSpy = jasmine.createSpy();
            errorSpy = jasmine.createSpy();
        });
        beforeEach(async(() => {
            TestBed.configureTestingModule({
                providers: [StopsResolver,
                    {
                        provide: ApiService,
                        useValue: {
                            getStations: getSpy,
                        },
                    }, {
                        provide: Router,
                        useValue: {
                            navigate: navigateSpy,
                        },
                    }, {
                        provide: MatDialog,
                        useClass: TestMatDialog,
                    }],
            });
            resolver = TestBed.get(StopsResolver);
        }));

        afterEach(() => {
            getSpy.calls.reset();
            nextSpy.calls.reset();
            navigateSpy.calls.reset();
            errorSpy.calls.reset();
        });

        describe('resolve(route, state)', () => {
            describe('a 404 error occurs', () => {
                const testError: HttpErrorResponse = new HttpErrorResponse({ status: 404 });
                beforeEach(() => {
                    getSpy.and.returnValue(throwError(testError));
                });
                it('should redirect to the 404 page', (done) => {
                    resolver.resolve(undefined, undefined)
                        .subscribe(nextSpy, errorSpy, () => {
                            expect(nextSpy).toHaveBeenCalledTimes(0);
                            expect(errorSpy).toHaveBeenCalledTimes(0);
                            expect(navigateSpy).toHaveBeenCalledTimes(1);
                            expect(navigateSpy).toHaveBeenCalledWith(['error', 'not-found']);
                            done();
                        });
                });
            });
        });
    });
});

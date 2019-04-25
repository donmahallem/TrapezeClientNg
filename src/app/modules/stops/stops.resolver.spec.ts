import { async, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services';
import { StopsResolver } from './stops.resolver';
// import * as sinon from "sinon";
describe('src/app/modules/stops/stops.resolver', () => {
    describe('StopsResolver', () => {
        let resolver: StopsResolver;
        let getSpy: jasmine.Spy<InferableFunction>;
        let navigateSpy: jasmine.Spy<InferableFunction>;
        let nextSpy: jasmine.Spy<InferableFunction>;
        beforeAll(() => {
            getSpy = jasmine.createSpy();
            navigateSpy = jasmine.createSpy();
            nextSpy = jasmine.createSpy();
        });
        beforeEach(async(() => {
            TestBed.configureTestingModule({
                providers: [StopsResolver,
                    {
                        provide: ApiService,
                        useValue: {
                            getTripPassages: getSpy,
                        },
                    }, {
                        provide: Router,
                        useValue: {
                            navigate: navigateSpy,
                        },
                    }],
            });
            resolver = TestBed.get(StopsResolver);
        }));

        afterEach(() => {
            getSpy.calls.reset();
            nextSpy.calls.reset();
            navigateSpy.calls.reset();
        });

        describe('resolve(route, state)', () => {
            it('needs to be implemented');
        });
    });
});

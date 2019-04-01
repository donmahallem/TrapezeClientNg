import { TestBed, async } from "@angular/core/testing";
import { ApiService } from "./api.service";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
//import * as sinon from "sinon";
describe('src/app/services/api.service', () => {
    describe('ApiService', () => {
        let apiService: ApiService;
        let getSpy: jasmine.Spy<InferableFunction>;
        const testEndpoint: string = "https://test.com/";
        beforeAll(() => {
            getSpy = jasmine.createSpy();
        });
        beforeEach(async(() => {
            getSpy.and.callFake((url: string): Observable<any> => {
                return of(url);
            });
            TestBed.configureTestingModule({
                providers: [ApiService,
                    {
                        provide: HttpClient,
                        useValue: {
                            get: getSpy
                        }
                    }]
            });
            apiService = TestBed.get(ApiService);
            spyOn(apiService, 'baseUrl').and.returnValue(testEndpoint);
        }));

        afterEach(() => {
            getSpy.calls.reset();
        });

        describe('getTripPassages(tripId)', () => {
            it('should construct the request correctly', (done) => {
                const testId: string = "testId1234";
                apiService.getTripPassages(testId).subscribe((res) => {
                    expect(res).toEqual(testEndpoint + 'api/trip/testId1234/passages?mode=departure');
                }, done, done);
            });
        })
    });
});

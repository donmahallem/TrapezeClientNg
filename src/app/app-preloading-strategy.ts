import { PreloadingStrategy, Route } from '@angular/router';
import { of, Observable } from 'rxjs';

export class AppPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: Function): Observable<any> {
    return route.path.startsWith('not-found') ? load() : of(undefined);
  }
}

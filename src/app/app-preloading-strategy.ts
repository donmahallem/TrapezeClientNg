import { PreloadingStrategy, Route } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';

export class AppPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: Function): Observable<any> {
    return route.path.startsWith('error') ? load() : EMPTY;
  }
}

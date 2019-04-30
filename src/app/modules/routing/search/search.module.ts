import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SearchResultResolver } from './search-result.resolver';
import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
@NgModule({
    declarations: [
        SearchComponent,
    ],
    imports: [
        CommonModule,
        SearchRoutingModule,
    ],
    providers: [
        SearchResultResolver,
    ],
})
export class SearchModule { }

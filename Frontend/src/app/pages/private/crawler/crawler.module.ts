import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrawlerRoutingModule } from './crawler-routing.module';
import { CrawlerComponent } from './crawler.component';
import { TranslatePipe } from '@ngx-translate/core';


@NgModule({
  declarations: [
    CrawlerComponent
  ],
  imports: [
    CommonModule,
    CrawlerRoutingModule,
    TranslatePipe
  ]
})
export class CrawlerModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

import { AboutwebsiteRoutingModule } from './aboutwebsite-routing.module';
import { AboutwebsiteComponent } from './aboutwebsite.component';

@NgModule({
  declarations: [
    AboutwebsiteComponent
  ],
  imports: [
    CommonModule,
    TranslatePipe,
    AboutwebsiteRoutingModule,
  ]
})
export class AboutwebsiteModule { }

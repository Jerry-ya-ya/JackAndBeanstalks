import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutwebsiteRoutingModule } from './aboutwebsite-routing.module';
import { AboutwebsiteComponent } from './aboutwebsite.component';

@NgModule({
  declarations: [
    AboutwebsiteComponent
  ],
  imports: [
    CommonModule,
    AboutwebsiteRoutingModule,
  ]
})
export class AboutwebsiteModule { }

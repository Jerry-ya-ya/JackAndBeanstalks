import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerifiedRoutingModule } from './verified-routing.module';
import { VerifiedComponent } from './verified.component';


@NgModule({
  declarations: [
    VerifiedComponent
  ],
  imports: [
    CommonModule,
    VerifiedRoutingModule
  ]
})
export class VerifiedModule { }

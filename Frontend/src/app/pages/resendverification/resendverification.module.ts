import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResendverificationRoutingModule } from './resendverification-routing.module';
import { ResendverificationComponent } from './resendverification.component';

import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ResendverificationComponent
  ],
  imports: [
    CommonModule,
    ResendverificationRoutingModule,
    FormsModule,
  ]
})
export class ResendverificationModule { }

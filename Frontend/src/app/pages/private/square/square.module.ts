import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SquareRoutingModule } from './square-routing.module';
import { SquareComponent } from './square.component';


@NgModule({
  declarations: [
    SquareComponent
  ],
  imports: [
    CommonModule,
    SquareRoutingModule
  ]
})
export class SquareModule { }

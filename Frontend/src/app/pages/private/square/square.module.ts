import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

import { SquareRoutingModule } from './square-routing.module';
import { SquareComponent } from './square.component';


@NgModule({
  declarations: [
    SquareComponent
  ],
  imports: [
    CommonModule,
    SquareRoutingModule,
    TranslatePipe
  ]
})
export class SquareModule { }

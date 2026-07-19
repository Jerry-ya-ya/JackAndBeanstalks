import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

import { UpdateRoutingModule } from './update-routing.module';
import { UpdateComponent } from './update.component';


@NgModule({
  declarations: [
    UpdateComponent
  ],
  imports: [
    CommonModule,
    TranslatePipe,
    UpdateRoutingModule
  ]
})
export class UpdateModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { PromoteRoutingModule } from './promote-routing.module';
import { PromoteComponent } from './promote.component';


@NgModule({
  declarations: [
    PromoteComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    PromoteRoutingModule
  ]
})
export class PromoteModule { }

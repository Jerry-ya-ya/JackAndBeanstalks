import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserhomeRoutingModule } from './userhome-routing.module';
import { UserhomeComponent } from './userhome.component';


@NgModule({
  declarations: [
    UserhomeComponent
  ],
  imports: [
    CommonModule,
    UserhomeRoutingModule
  ]
})
export class UserhomeModule { }

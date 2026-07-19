import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

import { UserhomeRoutingModule } from './userhome-routing.module';
import { UserhomeComponent } from './userhome.component';


@NgModule({
  declarations: [
    UserhomeComponent
  ],
  imports: [
    CommonModule,
    TranslatePipe,
    UserhomeRoutingModule
  ]
})
export class UserhomeModule { }

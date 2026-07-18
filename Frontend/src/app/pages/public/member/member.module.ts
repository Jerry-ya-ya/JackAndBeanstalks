import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

import { MemberRoutingModule } from './member-routing.module';
import { MemberComponent } from './member.component';


@NgModule({
  declarations: [
    MemberComponent
  ],
  imports: [
    CommonModule,
    TranslatePipe,
    MemberRoutingModule
  ]
})
export class MemberModule { }

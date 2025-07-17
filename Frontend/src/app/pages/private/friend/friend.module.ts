import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FriendRoutingModule } from './friend-routing.module';
import { FriendComponent } from './friend.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    FriendComponent
  ],
  imports: [
    CommonModule,
    FriendRoutingModule,
    FormsModule,
  ]
})
export class FriendModule { }

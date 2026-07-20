import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';

import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    FormsModule,
    TranslatePipe
  ]
})
export class ProfileModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingRoutingModule } from './setting-routing.module';
import { SettingComponent } from './setting.component';

import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';


@NgModule({
  declarations: [
    SettingComponent
  ],
  imports: [
    CommonModule,
    SettingRoutingModule,
    FormsModule,
    TranslatePipe
  ]
})
export class SettingModule { }

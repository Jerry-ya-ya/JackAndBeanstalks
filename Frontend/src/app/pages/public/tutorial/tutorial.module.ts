import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

import { TutorialRoutingModule } from './tutorial-routing.module';
import { TutorialComponent } from './tutorial.component';


@NgModule({
  declarations: [
    TutorialComponent
  ],
  imports: [
    CommonModule,
    TranslatePipe,
    TutorialRoutingModule
  ]
})
export class TutorialModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { ProjectRecruitmentRoutingModule } from './project-recruitment-routing.module';
import { ProjectRecruitmentComponent } from './project-recruitment.component';

@NgModule({
  declarations: [
    ProjectRecruitmentComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ProjectRecruitmentRoutingModule,
    TranslatePipe,
  ]
})
export class ProjectRecruitmentModule { }

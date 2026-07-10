import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectRecruitmentComponent } from './project-recruitment.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectRecruitmentComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRecruitmentRoutingModule { }

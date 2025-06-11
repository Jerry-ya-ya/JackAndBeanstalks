import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Component
import { MemberComponent } from './member.component';

const routes: Routes = [
  {
    path: '',
    component: MemberComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoutingModule { }

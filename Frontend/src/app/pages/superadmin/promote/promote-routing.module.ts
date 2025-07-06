import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromoteComponent } from './promote.component';

const routes: Routes = [
  {
    path: '',
    component: PromoteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromoteRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResendverificationComponent } from './resendverification.component';

const routes: Routes = [
  {
    path: '',
    component: ResendverificationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResendverificationRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifiedComponent } from './verified.component';

const routes: Routes = [
  {
    path: '',
    component: VerifiedComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifiedRoutingModule { }

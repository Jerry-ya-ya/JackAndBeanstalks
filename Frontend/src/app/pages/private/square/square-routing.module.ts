import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Component
import { SquareComponent } from './square.component';

const routes: Routes = [
  {
    path: '',
    component: SquareComponent,
  },
  {
    path: ':id',
    component: SquareComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SquareRoutingModule { }

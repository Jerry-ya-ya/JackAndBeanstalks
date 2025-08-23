import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserhomeComponent } from './userhome.component';

const routes: Routes = [
  {
    path: '',
    component: UserhomeComponent
  },
  {
    path: ':id',
    component: UserhomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserhomeRoutingModule { }

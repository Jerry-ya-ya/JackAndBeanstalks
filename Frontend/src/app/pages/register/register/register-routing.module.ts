import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Component
import { RegisterComponent } from './register.component';

const routes: Routes = [
  {
    path: '',
    component: RegisterComponent,
  },
  {
    path:'resendverification',
    loadChildren: () =>
      import('../resendverification/resendverification.module').then(m => m.ResendverificationModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterRoutingModule { }
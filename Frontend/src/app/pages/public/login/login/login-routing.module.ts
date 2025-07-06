import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Component
import { LoginComponent } from './login.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'forgotpassword',
    loadChildren: () =>
      import('../forgotpassword/forgotpassword.module').then(m => m.ForgotpasswordModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [
    RouterModule,
  ]
})
export class LoginRoutingModule { }

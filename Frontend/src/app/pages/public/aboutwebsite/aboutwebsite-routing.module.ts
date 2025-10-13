import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutwebsiteComponent } from './aboutwebsite.component';

const routes: Routes = [
  {
    path: '',
    component: AboutwebsiteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutwebsiteRoutingModule { }

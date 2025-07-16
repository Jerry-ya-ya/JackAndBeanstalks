import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//AppPath
import { appPath } from '../path/app-path-const'; // Adjust the import path as necessary

const routes: Routes = [
  {
    path: '',
    redirectTo: appPath.home,
    pathMatch: 'full',
  },
  {
    path: appPath.home,
    loadChildren: () =>
      import('../pages/public/home/home.module').then(m => m.HomeModule),
  },
  {
    path: appPath.crawler,
    loadChildren: () =>
      import('../pages/private/crawler/crawler.module').then(m => m.CrawlerModule),
  },
  {
    path: appPath.login,
    loadChildren: () =>
      import('../pages/public/login/login/login.module').then(m => m.LoginModule)
  },
  {
    path: appPath.member,
    loadChildren: () =>
      import('../pages/public/member/member.module').then(m => m.MemberModule)
  },
  {
    path: appPath.profile,
    loadChildren: () =>
      import('../pages/private/profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: appPath.register,
    loadChildren: () =>
      import('../pages/public/register/register/register.module').then(m => m.RegisterModule)
  },
  {
    path: appPath.setting,
    loadChildren: () =>
      import('../pages/private/setting/setting.module').then(m => m.SettingModule)
  },
  {
    path: appPath.square,
    loadChildren: () =>
      import('../pages/private/square/square.module').then(m => m.SquareModule)
  },
  { 
    path: appPath.todo,
    loadChildren: () =>
      import('../pages/private/todo/todo.module').then(m => m.TodoModule)
  },
  {
    path: appPath.promote,
    loadChildren: () =>
      import('../pages/superadmin/promote/promote.module').then(m => m.PromoteModule)
  },
  {
    path: '**',
    redirectTo: '',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

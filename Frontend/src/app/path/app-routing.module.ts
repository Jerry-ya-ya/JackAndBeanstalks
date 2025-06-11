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
      import('../pages/home/home.module').then(m => m.HomeModule),
  },
  {
    path: appPath.crawler,
    loadChildren: () =>
      import('../pages/crawler/crawler.module').then(m => m.CrawlerModule),
  },
  {
    path: appPath.login,
    loadChildren: () =>
      import('../pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path: appPath.member,
    loadChildren: () =>
      import('../pages/member/member.module').then(m => m.MemberModule)
  },
  {
    path: appPath.profile,
    loadChildren: () =>
      import('../pages/profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: appPath.register,
    loadChildren: () =>
      import('../pages/register/register.module').then(m => m.RegisterModule)
  },
  {
    path: appPath.setting,
    loadChildren: () =>
      import('../pages/setting/setting.module').then(m => m.SettingModule)
  },
  {
    path: appPath.square,
    loadChildren: () =>
      import('../pages/square/square.module').then(m => m.SquareModule)
  },
  {
    path: appPath.todo,
    loadChildren: () =>
      import('../pages/todo/todo.module').then(m => m.TodoModule)
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

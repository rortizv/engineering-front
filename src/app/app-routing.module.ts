import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginPage } from './components/login/login.page';
import { RegisterPage } from './components/register/register.page';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'dashboard', loadChildren: () => import('./components/dashboard/dashboard.module').then(x => x.DashboardPageModule), canActivate: [AuthGuard] },
  { path: 'login', loadChildren: () => import('./components/login/login.module').then( m => m.LoginPageModule) },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'user-detail',
    loadChildren: () => import('./components/user-detail/user-detail.module').then( m => m.UserDetailPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./components/register/register.module').then( m => m.RegisterPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: 'inicio',
    canActivate: [authGuard],
    loadComponent: () => import('./features/inicio/inicio').then(m => m.Inicio)
  },
  { path: '**', redirectTo: 'inicio' }
];
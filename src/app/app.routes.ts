import { Routes } from '@angular/router';
import { loginGuard } from './guards/login.guard';
import { inicioGuard } from './guards/inicio.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage),
    canActivate: [loginGuard]
  },
  {
    path: 'recuperar',
    loadComponent: () => import('./pages/recuperar/recuperar.page').then( m => m.RecuperarPage)
  },
  {
    path: 'incorrecto',
    loadComponent: () => import('./pages/incorrecto/incorrecto.page').then( m => m.IncorrectoPage)
  },
  {
    path: 'correcto',
    loadComponent: () => import('./pages/correcto/correcto.page').then( m => m.CorrectoPage)
  },
  {
    path: 'temas',
    loadComponent: () => import('./pages/temas/temas.page').then( m => m.TemasPage)
  },
  {
    path: 'miruta',
    loadComponent: () => import('./pages/miruta/miruta.page').then( m => m.MirutaPage)
  },
  {
    path: 'inicio',
    loadComponent: () => import('./pages/inicio/inicio.page').then( m => m.InicioPage),
    canActivate: [inicioGuard]
  },
  {
    path: 'registrarme',
    loadComponent: () => import('./pages/registrarme/registrarme.page').then( m => m.RegistrarmePage)
  },
];

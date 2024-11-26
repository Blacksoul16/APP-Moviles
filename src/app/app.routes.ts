import { Routes } from '@angular/router';
import { inicioGuard } from './guards/inicio.guard';
import { loginGuard } from './guards/login.guard';

export const routes: Routes = [
	{
		path: '',
		redirectTo: 'login',
		pathMatch: 'full',
	},
	{
		path: 'correcto',
		loadComponent: () => import('./pages/correcto/correcto.page').then( m => m.CorrectoPage)
	},
	{
		path: 'incorrecto',
		loadComponent: () => import('./pages/incorrecto/incorrecto.page').then( m => m.IncorrectoPage)
	},
	{
		path: 'inicio',
		loadComponent: () => import('./pages/inicio/inicio.page').then( m => m.InicioPage),
		canActivate: [inicioGuard]
	},
	{
		path: 'login',
		loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage),
		canActivate: [loginGuard]
	},
	{
		path: 'miruta',
		loadComponent: () => import('./pages/miruta/miruta.page').then( m => m.MirutaPage)
	},
	{
		path: 'recuperar',
		loadComponent: () => import('./pages/recuperar/recuperar.page').then( m => m.RecuperarPage)
	},
	{
		path: 'temas',
		loadComponent: () => import('./pages/temas/temas.page').then( m => m.TemasPage)
	},
  {
    path: 'registrarme',
    loadComponent: () => import('./pages/registrarme/registrarme.page').then( m => m.RegistrarmePage)
  },
];

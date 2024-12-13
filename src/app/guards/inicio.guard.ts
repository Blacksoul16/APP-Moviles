import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastsService } from '../services/toasts.service';

export const inicioGuard: CanActivateFn = async (route, state) => {

	const authService = inject(AuthService)
	const router = inject(Router)
	const toast = inject(ToastsService)

	if (await authService.isAuthed()) {
		return true
	}
	toast.showMsg("Debes iniciar sesión para acceder a esta página.", 2000, "danger")
	router.navigate(["/login"])
	return false
};
